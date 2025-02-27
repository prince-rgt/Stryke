interface ButtonV1Propos {
  classes?: string;
  label: string;
}

interface ButtonV2Props {
  label: string;
  classes?: string;
}

const ButtonV1 = ({ classes, label }: ButtonV1Propos) => {
  return <div className={`${classes} rounded text-xs px-2 pb-1 pt-1.5`}>{label}</div>;
};

const ButtonV2 = ({ label, classes }: ButtonV2Props) => {
  return <button className={`px-3 py-2 bg-[#3C3C3C]/70 font-medium ${classes}`}>{label}</button>;
};

export { ButtonV1, ButtonV2 };
