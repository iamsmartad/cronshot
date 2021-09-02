package core

import (
	coreclientset "k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
)

func GetClientset() (*coreclientset.Clientset, error) {
	// creates the in-cluster config
	config, err := rest.InClusterConfig()
	if err != nil {
		return nil, err
	}
	// create the clientset
	clientset, err := coreclientset.NewForConfig(config)
	if err != nil {
		return nil, err
	}
	return clientset, nil
}
