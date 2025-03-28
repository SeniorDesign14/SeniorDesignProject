import { Text, View } from "react-native";
import { useRouter, Redirect } from 'expo-router';

// direct to tabs list when bootup
// export default function Index() {
//   return (
//     <Redirect href="/(tabs)/dining" />
//   );
// }

// change this to login if we ever want to do the login screen
export default function Index() {
  return (
    <Redirect href="/dining" />
  );
}