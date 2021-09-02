package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"time"

	log "github.com/sirupsen/logrus"

	snapshots "github.com/iamsmartad/cronshot/pkg/snapshots"
	types "github.com/iamsmartad/cronshot/pkg/types"

	volumesnapshotv1 "github.com/kubernetes-csi/external-snapshotter/client/v4/apis/volumesnapshot/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func runAsAgent(commandbase64 string) {
	// decode command arg from base64 into (hopefully) json
	command, err := base64.StdEncoding.DecodeString(commandbase64)
	if err != nil {
		log.Fatal(err)
	}
	// unmarshall command into base64Command struct
	data := &types.Base64Command{}
	err = json.Unmarshal(command, &data)
	if err != nil {
		log.Fatal(err)
	}
	log.Infof("found valid command arg %s", string(command))

	data.SnapshotLabelKey = "iamstudent.dev/cronshotsnap"
	data.SnapshotLabelValue = fmt.Sprintf("%s-%s", data.Name, data.PVCorContent)

	client, errClient := snapshots.GetClientset()
	if errClient != nil {
		log.Fatal(errClient)
	}

	// use unique name with timestamp for new snapshot
	data.CurrentSnapshotName = data.Name + time.Now().Format("-jan-02-2006-15-04-05")
	data.CurrentSnapshotName = strings.ToLower(data.CurrentSnapshotName)
	var newSnapshot *volumesnapshotv1.VolumeSnapshot
	switch data.FromContent {
	case false:
		newSnapshot = getSnapshotWithPVCSource(data)
	case true:
		newSnapshot = getSnapshotWithSnapContentSource(data)
	}

	log.Infof("creating new snapshot: %s", data.CurrentSnapshotName)
	_, err = client.SnapshotV1().VolumeSnapshots(data.Namespace).Create(
		context.Background(),
		newSnapshot,
		metav1.CreateOptions{})
	if err != nil {
		log.Fatalf("err: %v", err)
	}

	log.Infof("checking for previous snapshots with config %s-%s", data.Name, data.PVCorContent)
	previousSnaps, err := client.SnapshotV1().VolumeSnapshots(data.Namespace).List(
		context.Background(),
		metav1.ListOptions{
			LabelSelector: data.SnapshotLabelKey + "=" + data.SnapshotLabelValue,
		})
	if err != nil {
		log.Fatalf("err: %v", err)
	}

	// make sure data.Retention has sane value
	if data.Retention > 0 {
		if nrOfPreviousSnapshots := len(previousSnaps.Items); nrOfPreviousSnapshots > data.Retention {
			log.Warnf("found %d previous snapshots, deleting %d old snpashots now", nrOfPreviousSnapshots, len(previousSnaps.Items)-data.Retention)
			sort.Slice(previousSnaps.Items, func(p, q int) bool {
				return previousSnaps.Items[p].CreationTimestamp.Before(&previousSnaps.Items[q].CreationTimestamp)
			})
			for i := 0; i < (len(previousSnaps.Items) - data.Retention); i++ {
				log.Warnf("Deleting snapshot %s", previousSnaps.Items[i].GetName())
				err := client.SnapshotV1().VolumeSnapshots(data.Namespace).Delete(context.Background(), previousSnaps.Items[i].GetName(), metav1.DeleteOptions{})
				if err != nil {
					log.Fatalf("err: %v", err)
				}
			}
		}
	}
}

func getSnapshotWithPVCSource(data *types.Base64Command) *volumesnapshotv1.VolumeSnapshot {
	return &volumesnapshotv1.VolumeSnapshot{
		ObjectMeta: metav1.ObjectMeta{
			Name:      data.CurrentSnapshotName,
			Namespace: data.Namespace,
			Labels: map[string]string{
				data.SnapshotLabelKey: data.SnapshotLabelValue,
			},
		},
		Spec: volumesnapshotv1.VolumeSnapshotSpec{
			Source: volumesnapshotv1.VolumeSnapshotSource{
				PersistentVolumeClaimName: &data.PVCorContent,
			},
			VolumeSnapshotClassName: &data.Snapshotclass,
		},
	}
}

func getSnapshotWithSnapContentSource(data *types.Base64Command) *volumesnapshotv1.VolumeSnapshot {
	return &volumesnapshotv1.VolumeSnapshot{
		ObjectMeta: metav1.ObjectMeta{
			Name:      data.CurrentSnapshotName,
			Namespace: data.Namespace,
			Labels: map[string]string{
				data.SnapshotLabelKey: data.SnapshotLabelValue,
			},
		},
		Spec: volumesnapshotv1.VolumeSnapshotSpec{
			Source: volumesnapshotv1.VolumeSnapshotSource{
				VolumeSnapshotContentName: &data.PVCorContent,
			},
			VolumeSnapshotClassName: &data.Snapshotclass,
		},
	}
}
