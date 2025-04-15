import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  title: string,
  handlePress: () => void | Promise<void>,
  containerStyles?: string,
  textStyles?: string,
  isLoading?: boolean,
  disabled?: boolean
}

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`w-full md:w-1/2 rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles}${isLoading ? "opacity-50" : ""
        }`}
      disabled={props.disabled}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles} text-white`} >
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