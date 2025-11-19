import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  title: string,
  handlePress: () => void | Promise<void>,
  containerStyles?: string,
  textStyles?: string,
  isLoading?: boolean,
  disabled?: boolean,
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
}

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  variant = 'primary',
  ...props
}: ButtonProps) => {

  // Modern variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-accent shadow-lg shadow-accent/30 active:scale-95';
      case 'secondary':
        return 'bg-surface-elevated border-2 border-accent/30 active:bg-surface-hover';
      case 'outline':
        return 'bg-transparent border-2 border-gray-600 active:bg-gray-800/30';
      case 'ghost':
        return 'bg-transparent active:bg-gray-800/30';
      case 'danger':
        return 'bg-error shadow-lg shadow-error/30 active:scale-95';
      default:
        return 'bg-accent shadow-lg shadow-accent/30 active:scale-95';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return 'text-white';
      default:
        return 'text-white';
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className={`w-full md:w-1/2 rounded-2xl min-h-[58px] flex flex-row justify-center items-center transition-all ${getVariantStyles()} ${containerStyles} ${
        isLoading || props.disabled ? "opacity-50" : ""
      }`}
      disabled={props.disabled || isLoading}
    >
      <Text className={`font-pbold text-base tracking-wide ${getTextStyles()} ${textStyles}`}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;