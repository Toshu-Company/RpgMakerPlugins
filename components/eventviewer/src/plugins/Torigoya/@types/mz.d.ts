declare class Torigoya {
  static Achievement2: TorigoyaMZ_Achievement2;
}

declare class TorigoyaMZ_Achievement2 {
  parameter: TorigoyaMZ_Achievement2.Parameter;
  Manager: TorigoyaMZ_Achievement2.AchievementManager;
}

namespace TorigoyaMZ_Achievement2 {
  type Parameter = {
    baseAchievementData: AchievementData[];
    titleMenuText: string;
    titleMenuUseInMenu: true;
    titleMenuUseInTitle: false;
  };

  type AchievementData = {
    key: string;
    title: string;
    description: string;
    icon: number;
    hint: string;
    meta: any;
    metaArray: any;
    note: string;
  };

  declare class AchievementManager {
    achievements: AchievementData[];
    unlockInfo: Map<string, AchievementManager.UnlockInfo>;
    options: AchievementManager.Options;

    unlock(key: string): boolean;
  }

  namespace AchievementManager {
    type UnlockInfo = {
      date: number;
    };
    type Options = {
      onInit: (manager: AchievementManager) => void;
      onSave: (manager: AchievementManager) => void;
      overwritable: boolean;
    };
  }
}
