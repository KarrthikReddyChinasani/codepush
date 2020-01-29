import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import CodePush from 'react-native-code-push';

class CodePushUpdateButton extends Component {
    state = {
        info: null,
        status: null,
        mismatch: false,
    };

    componentDidMount() {
        if (!CodePush) return;
        CodePush.getUpdateMetadata().then(update => {
            if (!update) return;
            let info = update.label;
            if (update.description) {
                info += ' (' + update.description + ')';
            }
            this.setState({
                info,
            });
        });
    }

    lookForUpdate = () => {
        CodePush.sync(
            {
                updateDialog: {
                    appendReleaseDescription: true,
                    descriptionPrefix: '\n\nChangelog:\n',
                },
                installMode: CodePush.InstallMode.IMMEDIATE,
            },
            SyncStatus => {
                switch (SyncStatus) {
                    case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                        this.setState({ status: 'Checking for update' });
                        break;
                    case CodePush.SyncStatus.AWAITING_USER_ACTION:
                        this.setState({ status: 'Awaiting action' });
                        break;
                    case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                        this.setState({ status: 'Downloading' });
                        break;
                    case CodePush.SyncStatus.INSTALLING_UPDATE:
                        this.setState({ status: 'Installing' });
                        break;
                    default:
                        this.setState({ status: 'No update found' });
                }
            },
            null,
            mismatch => mismatch && this.setState({ mismatch: true })
        );
    };

    render() {
        if (this.state.mismatch) {
            return <Text style={{ fontSize: 11 }}>New version on HockeyApp</Text>;
        }

        return (
            <TouchableOpacity style={{ marginLeft: 5 }} onPress={this.lookForUpdate}>
                <Text style={{ fontSize: 12 }}>{this.state.status || 'Check update'}</Text>
                {!!this.state.info && (
                    <Text style={{ fontSize: 8, maxWidth: 150 }} numberOfLines={3}>
                        {this.state.info}
                    </Text>
                )}
            </TouchableOpacity>
        );
    }
}

export default CodePushUpdateButton;