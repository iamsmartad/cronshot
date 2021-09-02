package main

import (
	"fmt"

	log "github.com/sirupsen/logrus"

	core "github.com/iamsmartad/cronshot/pkg/core"
)

func handleClientRequest(evt string, msg []byte) error {
	log.Printf("got %v", evt)

	switch evt {
	case "createSchedule":
		core.CreateScheduledJob(msg, watchResources["CronJob"])
	case "deleteSchedule":
		core.DeleteScheduledJob(msg, watchResources["CronJob"])
	case "updateSchedule":
		core.UpdateScheduledJob(msg)
		// core.CreateScheduledJob(evt.Object)
	case "createSnapshot":
	case "deleteSnapshot":
	case "restoreSnapshot":
	case "signin":
	default:
		fmt.Println("unknown event")
	}
	return nil
}
