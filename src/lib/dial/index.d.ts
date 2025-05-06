

type SpeedDialCallback = function(SymbolDocumentItem|null, EventTarget|null): void;

interface SpeedDialParams {
    bg: string;
    hover: string;
    icon: any;
    onclick: SpeedDialCallback;
};

type SpeedDialOptionalParams = (SpeedDialParams|undefined);
type SpeedDialParamList = SpeedDialOptionalParams[];

