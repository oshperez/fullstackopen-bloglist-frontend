const Notification = ({notification: { type, message }}) => {
  return (
    <div className={`notification notification__${type}`}>
      <span>{message}</span>
    </div>
  );
};

export default Notification;
