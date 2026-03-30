import { useAuth } from '../context/AuthContext';
import ProfileCard from '../components/ProfileCard';

export default function ViewProfile() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            {/* Cabecera */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-gray-400 text-sm">
                    This is how other players see your profile.
                </p>
            </div>

            {/* Se reutiliza el componente ProfileCard con los datos del usuario logueado */}
            <ProfileCard playerData={user} isOwnProfile={true} />
        </div>
    );
}
