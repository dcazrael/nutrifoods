import Tabs from '../layout/Tabs';
import Log from './Log';
import PersonalInformation from './PersonalInformation';
import Settings from '../Settings';

function Profile() {
    const TAB_NAMES = ['Log', 'Profile', 'Settings'];
    const TAB_CONTENT = [<Log />, <PersonalInformation />, <Settings />];
    return (
        <div className="container relative flex-grow mx-auto">
            <Tabs tabNames={TAB_NAMES} tabContent={TAB_CONTENT} />
        </div>
    );
}

export default Profile;
