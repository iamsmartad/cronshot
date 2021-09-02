package core

import (
	"context"
	b64 "encoding/base64"
	"encoding/json"
	"fmt"
	"strconv"

	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"

	dynamicClient "github.com/iamsmartad/cronshot/pkg/dynamicClient"
	iamtypes "github.com/iamsmartad/cronshot/pkg/types"
	log "github.com/sirupsen/logrus"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime/schema"
)

func DeleteScheduledJob(msg []byte, cronjobSchema schema.GroupVersionResource) error {
	request := &iamtypes.WebsocketClientEvent{}
	err := json.Unmarshal(msg, request)
	if err != nil {
		fmt.Printf("err: %v (%v) ", err, string(msg))
		return err
	}
	obj := request.Object

	name, ok := obj["Name"].(string)
	if !ok {
		return fmt.Errorf("could not read `Name` key in client request as string")
	}
	namespace, ok := obj["Namespace"].(string)
	if !ok {
		return fmt.Errorf("could not read `Name` key in client request as string")
	}
	client, errClient := dynamicClient.GetClientset()
	if errClient != nil {
		return errClient
	}

	err = client.Resource(cronjobSchema).
		Namespace(namespace).
		Delete(
			context.Background(),
			name,
			metav1.DeleteOptions{})
	if err != nil {
		log.Warnf("%s", err.Error())
		return err
	}
	log.Warnf("deleted cronjob %s in namespace %s", name, namespace)
	return nil
}
func UpdateScheduledJob(msg []byte) error {
	return nil
}

func CreateScheduledJob(msg []byte, cronjobSchema schema.GroupVersionResource) error {
	request := &iamtypes.WebsocketClientEventSnapshot{}
	err := json.Unmarshal(msg, request)
	if err != nil {
		fmt.Printf("err: %v (%v) ", err, string(msg))
		return err
	}

	log.Infof("Creating Schedule %s", request.Object.Name)

	// fixed vars
	var (
		image            = "iamimages/cronshot"
		containername    = "cronshot"
		serviceaccount   = "cronshot"
		namespaceCronjob = "truth"
	)

	jsonCommand, err := json.Marshal(&request.Object)
	if err != nil {
		log.Warn(err)
	}
	base64Command := b64.StdEncoding.EncodeToString(jsonCommand)

	var command = []string{
		"/root/app",
		"--agent",
		"--commandbase64",
		base64Command}

	cronjob := unstructured.Unstructured{
		Object: map[string]interface{}{
			"metadata": map[string]interface{}{
				"name": request.Object.Name,
				"labels": map[string]string{
					"iamstudent.dev/cronshot": "true",
				},
				"annotations": map[string]string{
					"fromContent":   strconv.FormatBool(request.Object.FromContent),
					"source":        request.Object.PVCorContent,
					"snapshotclass": request.Object.Snapshotclass,
					"retention":     fmt.Sprintf("%d", request.Object.Retention),
				},
			},
			"spec": map[string]interface{}{
				"schedule": request.Object.Crontab,
				"jobTemplate": map[string]interface{}{
					"spec": map[string]interface{}{
						"template": map[string]interface{}{
							"spec": map[string]interface{}{
								"containers": []map[string]interface{}{
									{
										"name":            containername,
										"image":           image,
										"command":         command,
										"imagePullPolicy": "Always",
									},
								},
								"restartPolicy":      "Never",
								"serviceAccountName": serviceaccount,
								// "imagePullSecrets": []map[string]interface{}{
								// 	{
								// 		"name": pullsecret,
								// 	},
								// },
							},
						},
					},
				},
			},
		},
	}

	client, errClient := dynamicClient.GetClientset()
	if errClient != nil {
		return errClient
	}

	cronResult, err := client.Resource(cronjobSchema).
		Namespace(namespaceCronjob).Create(
		context.Background(),
		&cronjob,
		metav1.CreateOptions{})
	if err != nil {
		log.Warnf("%s", err.Error())
		return err
	}

	log.Infof("created CronJob %v", cronResult.GetName())
	return nil
}
