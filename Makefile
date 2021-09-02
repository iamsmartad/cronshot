REGISTRY = iamimages
IMAGENAME = cronshot
TAG = latest

all: build-all

build-all: build-docker

build-docker: 
	docker build --target runner -t $(REGISTRY)/$(IMAGENAME):$(TAG) .

upload:
	docker push $(REGISTRY)/$(IMAGENAME):$(TAG)

release: build-docker upload
