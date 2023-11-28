const DisplayTime = (props: { value: number; isDanger: boolean }) => {
  return (
    <div>
      <p className={props.isDanger ? "text-red-500" : "text-second"}>
        {props.value.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
      </p>
    </div>
  );
};

export default DisplayTime;
