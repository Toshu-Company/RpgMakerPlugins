declare class TorigoyaMZ {
  static Achievement2: TorigoyaMZ_Achievement2;
}

declare class TorigoyaMZ_Achievement2 {
  parameter: TorigoyaMZ_Achievement2.Parameter;
  manager: TorigoyaMZ_Achievement2.AchievementManager;
}

namespace TorigoyaMZ_Achievement2 {
  type Parameter = {
    baseAchievementData: AchivementData[];
    titleMenuText: string;
    titleMenuUseInMenu: true;
    titleMenuUseInTitle: false;
  };

  type AchivementData = {
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
    achivements: AchivementData[];
    unlockInfo: Map<string, AchievementManager.UnlockInfo>;
    options: AchievementManager.Options;
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
