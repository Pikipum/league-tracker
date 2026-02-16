import DarkDropdownMenu from "./DarkDropdownMenu";

const queues = [
  "All Matches",
  "Ranked Solo",
  "Ranked Flex",
  "ARAM",
  "Arena",
  "Quickplay",
  "Swiftplay",
  "Normal Draft",
  "Clash",
];

const QueueSelect = ({ queueType, setQueueType }) => {
  return (
    <DarkDropdownMenu
      label={queueType}
      options={queues}
      selected={queueType}
      onSelect={setQueueType}
    />
  );
};

export default QueueSelect;
