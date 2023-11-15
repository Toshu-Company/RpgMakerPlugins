var rngd_recollection_mode_settings: rngd_recollection_mode_settings;

interface Window {
  rngd_recollection_mode_settings: rngd_recollection_mode_settings;
}

type rngd_recollection_mode_settings = {
  rec_cg_set: Record<
    number,
    {
      title: string;
      thumbnail: string;
      switch_id: number;
      common_event_id: number;
      pictures: string[];
    }
  >;
  rec_list_window: {
    item_height: number;
    item_width: number;
    never_watch_picture_name: string;
    never_watch_title_text: string;
    show_title_text: boolean;
    title_text_align: string;
  };
  rec_mode_bgm: {
    bgm: {
      name: string;
      pan: number;
      pitch: number;
      volume: number;
    };
  };
  rec_mode_window: {
    x: number;
    y: number;
    recollection_title: string;
    str_select_recollection: string;
    str_select_cg: string;
    str_select_back_title: string;
  };
  sandbox_map_id: number;
  share_recollection_switches: boolean;
};
