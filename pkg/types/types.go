package types

type WebsocketEvent struct {
	Event  string
	Object interface{}
}

type WebsocketClientEvent struct {
	Event  string
	Object map[string]interface{}
}

type WebsocketClientEventSnapshot struct {
	Event  string
	Object Base64Command
}

type Base64Command struct {
	Name                string
	Crontab             string
	CurrentSnapshotName string
	Namespace           string
	FromContent         bool
	PVCorContent        string
	Snapshotclass       string
	Retention           int
	SnapshotLabelKey    string
	SnapshotLabelValue  string
}
