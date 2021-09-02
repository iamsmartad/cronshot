package dynamicClient

import (
	"fmt"
	"time"

	log "github.com/sirupsen/logrus"

	iamtypes "github.com/iamsmartad/cronshot/pkg/types"

	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/client-go/dynamic/dynamicinformer"
	"k8s.io/client-go/tools/cache"
)

type DynamicController struct {
	informerFactory dynamicinformer.DynamicSharedInformerFactory
	informers       []cache.SharedIndexInformer
	channel         chan<- *iamtypes.WebsocketEvent
}

// Run starts shared informers and waits for the shared informer cache to
// synchronize.
func (c *DynamicController) Run(stopCh chan struct{}) error {
	// Starts all the shared informers that have been created by the factory so
	// far.
	c.informerFactory.Start(stopCh)
	// wait for the initial synchronization of the local cache.
	c.informerFactory.WaitForCacheSync(stopCh)
	// for _, inf := range c.informers {
	// 	if !cache.WaitForCacheSync(stopCh, inf.Informer().HasSynced) {
	// 		return fmt.Errorf("failed to sync")
	// 	}
	// }
	return nil
}

func (c *DynamicController) send(obj interface{}, operation string) {
	var jsonResp *iamtypes.WebsocketEvent
	switch v := obj.(type) {
	case *unstructured.Unstructured:
		evt := fmt.Sprintf("%s-%s/%s", operation, v.GetAPIVersion(), v.GetKind())
		log.Debugf("sending %s %s", evt, v.GetName())
		v.SetManagedFields(nil)
		jsonResp = &iamtypes.WebsocketEvent{Event: evt, Object: v}
	default:
		log.Warnf("unknown type %T", obj)
		jsonResp = &iamtypes.WebsocketEvent{Event: "unknownType", Object: nil}
	}
	c.channel <- jsonResp
}

func (c *DynamicController) add(obj interface{}) {
	c.send(obj, "add")
}

func (c *DynamicController) update(old, obj interface{}) {
	c.send(obj, "update")
}

func (c *DynamicController) delete(obj interface{}) {
	c.send(obj, "delete")
}

func WatchDynamic(c chan *iamtypes.WebsocketEvent, resources map[string]schema.GroupVersionResource) chan struct{} {
	// labelOptions := informerfactory.WithTweakListOptions(func(opts *metav1.ListOptions) {
	// 	// opts.LabelSelector = SYNCLABEL + "=config"
	// })
	client, errClient := GetClientset()
	if errClient != nil {
		log.Fatal(errClient)
	}

	factory := dynamicinformer.NewFilteredDynamicSharedInformerFactory(client, time.Hour*24, "", nil)

	controller := NewDynamicController(resources, factory, c)
	stop := make(chan struct{})
	err := controller.Run(stop)
	if err != nil {
		log.Fatal(err)
	}
	return stop
}

func NewDynamicController(resources map[string]schema.GroupVersionResource, factory dynamicinformer.DynamicSharedInformerFactory, channel chan<- *iamtypes.WebsocketEvent) *DynamicController {
	log.Debugf("start new dynamic informer")
	c := &DynamicController{
		informerFactory: factory,
		channel:         channel,
	}
	for _, i := range resources {
		c.informers = append(c.informers, c.informerFactory.ForResource(i).Informer())
	}

	for _, informer := range c.informers {
		informer.AddEventHandler(
			// Your custom resource event handlers.
			cache.ResourceEventHandlerFuncs{
				// Called on creation
				AddFunc: c.add,
				// Called on resource update and every resyncPeriod on existing resources.
				UpdateFunc: c.update,
				// Called on resource deletion.
				DeleteFunc: c.delete,
			},
		)
	}
	return c
}
