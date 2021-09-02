package snapshots

import (
	snapshotclientset "github.com/kubernetes-csi/external-snapshotter/client/v4/clientset/versioned"
	"k8s.io/client-go/rest"
)

func GetClientset() (*snapshotclientset.Clientset, error) {
	// creates the in-cluster config
	config, err := rest.InClusterConfig()
	if err != nil {
		return nil, err
	}
	// create the clientset
	clientset, err := snapshotclientset.NewForConfig(config)
	if err != nil {
		return nil, err
	}
	return clientset, nil
}
