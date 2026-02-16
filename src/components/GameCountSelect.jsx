import DarkDropdownMenu from "./DarkDropdownMenu";

const gameCountOptions = [
  { label: "Last 20", value: 20 },
  { label: "Last 100", value: 100 },
  { label: "All", value: null },
];

const GameCountSelect = ({ gameCount, setGameCount }) => {
  const currentLabel =
    gameCountOptions.find((o) => o.value === gameCount)?.label || "All";

  return (
    <DarkDropdownMenu
      label={currentLabel}
      options={gameCountOptions}
      selected={gameCount}
      onSelect={setGameCount}
      buttonSx={{ fontSize: "0.85rem", p: 0.5, minWidth: "auto" }}
    />
  );
};

export default GameCountSelect;
