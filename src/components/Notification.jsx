const Notification = ({notification: { type, message }}) => {
  return (
    <div className={`notification notification__${type}`} data-cy="notification">
      <span>{message}</span>
    </div>
  );
};

export default Notification;
