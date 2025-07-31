import type { ButtonProps } from "../../../types/components";

export function Button(props: ButtonProps) {
  const {
    className,
    children,
    testId,
    variant,
    size,
    isLoading,
    isDisabled,
    leftIcon,
    rightIcon,
    fullWidth,
  } = props;

  const variantClasses = {
    primary: [
      "bg-blue-600",
      "text-white",
      "hover:bg-blue-700",
      "focus:ring-blue-500",
      "active:bg-blue-800",
    ],
    secondary: [
      "bg-gray-200",
      "text-gray-900",
      "hover:bg-gray-300",
      "focus:ring-gray-500",
      "active:bg-gray-400",
    ],
    danger: [
      "bg-red-600",
      "text-white",
      "hover:bg-red-700",
      "focus:ring-red-500",
      "active:bg-red-800",
    ],
    warning: [
      "bg-yellow-500",
      "text-black",
      "hover:bg-yellow-300",
      "focus:ring-gray-500",
      "active:bg-yellow-200",
    ],
    info: [
      "bg-blue-200",
      "text-blue-800",
      "hover:bg-blue-300",
      "focus:ring-blue-500",
      "active:bg-blue-400",
    ],
  };

  const disabledClasses = ["cursor-not-allowed", "opacity-50"];
  const defaultClasses = ["flex items-center px-2 py-3 rounded-lg"];

  const buttonClasses = [
    ...defaultClasses,
    className,
    ...variantClasses[variant || "primary"],
    ...(isDisabled ? disabledClasses : []),
  ].join(" ");

  return (
    <>
      <button
        data-testId={testId}
        disabled={isDisabled}
        className={buttonClasses}
      >
        {leftIcon ? <span className="mr-2">{leftIcon}</span> : null}
        {isLoading ? "Cargando..." : children}
        {rightIcon ? <span className="ml-2">{rightIcon}</span> : null}
      </button>
    </>
  );
}
