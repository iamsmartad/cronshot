![go build](https://github.com/iamsmartad/cronshot/actions/workflows/go.yml/badge.svg)

# WIP

## go backend

- [ ] listeners

  - [x] PersistentVolumeClaim
  - [ ] PersistentVolume
  - [x] StorageClass
  - [x] VolumeAttachment
  - [x] CSIDriver
  - [x] CronJob
  - [x] VolumeSnapshot
  - [x] VolumeSnapshotContent
  - [x] VolumeSnapshotClass
  - [ ] CSIStorageCapacity

- [ ] websocket

  - [ ] send events via websocket

    - [x] add update delete
      - [x] schedule
      - [x] persistent volume claim
      - [ ] persistent volume
      - [x] storage class
      - [x] volume snapshot
      - [x] volume snapshot content
      - [x] volume snapshot class

  - [ ] receive commands via websocket
    - [ ] schedule
      - [x] create schedule
      - [x] delete schedule
      - [ ] update schedule
    - [ ] snapshot
      - [ ] create snapshot
      - [ ] delete snapshot
      - [ ] restore from snapshot

- [x] run as agent
- [ ] signin client

## react frontend

- [x] basic dashboard
- [x] lists

  - [x] PersistentVolumeClaim
  - [x] Snapshots
  - [x] Schedules
  - [ ] PV
  - [ ] SnapshotContents
  - [ ] storage backend? snapshots / volumes?

- [ ] JWT auth?

  - [ ] via k8s secret?
  - [ ] ENV?

- [ ] basic auth?
