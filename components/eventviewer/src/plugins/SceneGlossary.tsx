function SceneGlossary() {
    if (!window.Scene_Glossary) {
        return (<>
            Scene Glossary plugin not found.
        </>)
    }

    return (
        <div>
            <h1>SceneGlossary</h1>
            <button onClick={() => $gameParty.gainGlossaryAll()}>GLOSSARY_GAIN_ALL</button>
            <button onClick={() => $gameParty.loseGlossaryAll()}>GLOSSARY_LOSE_ALL</button>
        </div>
    )
}