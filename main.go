package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	log "github.com/sirupsen/logrus"

	"k8s.io/apimachinery/pkg/runtime/schema"

	core "github.com/iamsmartad/cronshot/pkg/core"
	dyn "github.com/iamsmartad/cronshot/pkg/dynamicClient"
	types "github.com/iamsmartad/cronshot/pkg/types"
)

const (
	appname = "cronshot"

	// Time allowed to write a message to the peer.
	writeWait = 5 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 10 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait) / 2

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var (
	newline       = []byte{'\n'}
	commandbase64 = flag.String("commandbase64", "e30=", "run as agent to perform snapshots")
	agent         = flag.Bool("agent", false, "run as agent to perform snapshots")
	addr          = flag.String("addr", "0.0.0.0:8080", "http service address")

	upgrader = websocket.Upgrader{
		ReadBufferSize:  maxMessageSize,
		WriteBufferSize: maxMessageSize,
	}

	watchResources = map[string]schema.GroupVersionResource{
		"PersistentVolumeClaim": {},
		"StorageClass":          {},
		"VolumeAttachment":      {},
		"CSIDriver":             {},
		"CronJob":               {},
		"VolumeSnapshot":        {},
		"VolumeSnapshotContent": {},
		"VolumeSnapshotClass":   {},
		// "CSIStorageCapacity":    {},
	}
)

func writer(c *websocket.Conn) error {
	pingTicker := time.NewTicker(pingPeriod)
	writeChannel := make(chan *types.WebsocketEvent, maxMessageSize)

	stopDynamicInformer := dyn.WatchDynamic(
		writeChannel,
		watchResources,
	)
	defer func() {
		pingTicker.Stop()
		close(stopDynamicInformer)
		c.Close()
	}()

	for {
		select {
		case wsEvent, ok := <-writeChannel:
			c.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.WriteMessage(websocket.CloseMessage, []byte{})
				return fmt.Errorf("error reading writeChannel")
			}

			w, err := c.NextWriter(websocket.TextMessage)
			if err != nil {
				return fmt.Errorf("error getting NextWriter")
			}
			js, err := json.Marshal(wsEvent)
			if err != nil {
				return fmt.Errorf("error marshaling wsEvent to json")
			}
			w.Write(js)

			// Add queued chat messages to the current websocket message.
			n := len(writeChannel)
			for i := 0; i < n; i++ {
				js, err := json.Marshal(<-writeChannel)
				if err != nil {
					fmt.Println("error marshaling wsEvent to json")
					continue
				}
				w.Write(newline)
				w.Write(js)
			}

			if err := w.Close(); err != nil {
				return fmt.Errorf("error closing NextWriter")
			}
		case <-pingTicker.C:
			c.SetWriteDeadline(time.Now().Add(writeWait))
			err := c.WriteControl(websocket.PingMessage, nil, time.Now().Add(pongWait))
			if err != nil {
				log.Infof("closing connection to client %v", c.RemoteAddr())
				return err
			}
		}
	}
}

func reader(c *websocket.Conn) {
	defer c.Close()
	c.SetReadLimit(maxMessageSize)
	c.SetReadDeadline(time.Now().Add(pongWait))
	c.SetPongHandler(func(string) error { c.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, msg, err := c.ReadMessage()
		if err != nil {
			break
		}

		request := &types.WebsocketClientEvent{}
		err = json.Unmarshal(msg, request)
		if err != nil {
			fmt.Printf("err: %v (%v) ", err, string(msg))
			continue
		}

		// send the full msg to the handler, so the implementation there can cast msg to
		// a more specific go object from json
		err = handleClientRequest(request.Event, msg)
		if err != nil {
			fmt.Printf("err: %v", err)
			continue
		}
	}
}

func ws(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}

	go writer(c)
	reader(c)
}

func main() {
	flag.Parse()

	for k := range watchResources {
		checkAPIGroup(k)
		log.Warnf("%v/%v", watchResources[k].GroupResource(), watchResources[k].GroupVersion())
	}

	if *agent {
		log.Infof("Running %s once (as agent)", appname)
		runAsAgent(*commandbase64)
		os.Exit(0)
	}

	http.HandleFunc("/ws", ws)
	// http.Handle("/home", http.FileServer(http.Dir(*directory)))

	log.Infof("starting server")
	log.Fatal(http.ListenAndServe(*addr, nil))
}

func checkAPIGroup(resource string) {
	client, err := core.GetClientset()
	if err != nil {
		log.Fatalf("%s has to run inside a kubernets cluster with valid access rights", appname)
	}
	prefRes, err := client.ServerPreferredResources()
	if err != nil {
		log.Fatalf("%v", err)
	}

	for _, v := range prefRes {
		for _, ble := range v.APIResources {
			if resource == ble.Kind {
				groupVersionResource := schema.GroupVersionResource{}

				groupAndVersion := strings.Split(v.GroupVersion, "/")
				if len(groupAndVersion) == 1 {
					groupVersionResource.Group = ""
					groupVersionResource.Version = groupAndVersion[0]
				} else {
					groupVersionResource.Group = groupAndVersion[0]
					groupVersionResource.Version = groupAndVersion[1]
				}
				groupVersionResource.Resource = ble.Name
				watchResources[resource] = groupVersionResource
			}
		}
	}
}
