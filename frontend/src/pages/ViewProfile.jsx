import { useAuth } from '../context/AuthContext';
import ProfileCard from '../components/ProfileCard';

// Public or personal view mirror that renders full ProfileCard components
export default function ViewProfile() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            {}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-gray-400 text-sm">
                    This is how other players see your profile.
                </p>
            </div>

            {}
            <ProfileCard playerData={user} isOwnProfile={true} />
        </div>
    );
}
