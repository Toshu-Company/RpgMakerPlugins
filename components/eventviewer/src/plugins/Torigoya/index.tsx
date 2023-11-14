function TorigoyaComponent() {
    return (<></>);
}

namespace TorigoyaTools {
    export namespace MZ_Achievement2 {
        export function data() {
            if (!Torigoya.Achievement2.Manager) {
                throw new Error('TorigoyaMZ_Achievement2 is not found');
            }
        }
        export function unlockAll() {
            Torigoya.Achievement2.Manager.achievements.every((achievement) => {
                return Torigoya.Achievement2.Manager.unlock(achievement.key);
            });
        }
    }
    namespace MZ_BattleStatusPosition {

    }
    namespace MZ_NotRemoveWeapon {

    }
    namespace MZ_QuickSkill {

    }
}