import { useEffect, useState } from "react";
import { apiComunication } from "../modules/apiComunication";

function FindTeams() {
    const [teamData, setTeamData] = useState(null);

    useEffect(() => {
        async function api() {
            if (!teamData) {
                let result = await apiComunication("GET", "/teams", "1|uW9qfY6ZnNSG0Xk7oWDHJTl4YA8dFa1it7vsfRpZ1bb026a9")
                setTeamData(result.data || null);
            }
        };
        api();
    }, [])

    if (teamData) {
        return (
            <div className="min-h-screen items-center justify-center px-4 text-white">
                <h1 onClick={() => console.log(teamData)}>Find Teams</h1>
                {teamData.map((team) => {
                    return (
                        <>
                            <br />
                            Name: {team.name}

                        </>
                    );
                })}
            </div>
        );
    } else {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 text-white">
                <h1>Error</h1>
            </div>
        );
    }
}

export default FindTeams;