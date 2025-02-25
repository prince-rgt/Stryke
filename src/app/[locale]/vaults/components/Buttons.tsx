interface ButtonV1Propos {
  classes?: string;
  label: string;
}

const ButtonV1 = ({ classes, label }: ButtonV1Propos) => {
  return <div className={`${classes} rounded text-xs px-2 pb-1 pt-1.5`}>{label}</div>;
};

export { ButtonV1 };
