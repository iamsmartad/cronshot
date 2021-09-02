package dynamicClient

import (
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/rest"
)

func GetClientset() (dynamic.Interface, error) {
	// creates the in-cluster config
	config, err := rest.InClusterConfig()
	if err != nil {
		return nil, err
	}
	// // create the clientset
	clientset, err := dynamic.NewForConfig(config)
	if err != nil {
		return nil, err
	}
	return clientset, nil
}
