function RecollectionModeComponent() {
    if (!window.rngd_recollection_mode_settings) {
        return (<>
            Recollection Mode plugin not found.
        </>)
    }

    function unlock() {
        Object.entries(rngd_recollection_mode_settings.rec_cg_set)
            .map(([k, v]) => v.switch_id)
            .forEach(x => $gameSwitches.setValue(x, true));
    }

    return (
        <div>
            <h1>RecollectionMode</h1>
            <button onClick={unlock}>RECOLLECTION_MODE_UNLOCK</button>
        </div>
    )
}