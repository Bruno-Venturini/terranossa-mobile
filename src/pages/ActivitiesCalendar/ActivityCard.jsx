import React, {useContext, useEffect, useState} from 'react';
import DateProgress from '../../components/DateProgress';
import DayActivityContext from './contexts/DayActivityContext';
import ActivityService from '../../services/ActivityService';
import CurrentDayContext from './contexts/CurrentDayContext';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import UserService from "@/services/UserService";

export default function ActivityCard({ activity }) {
  const { currentDay } = useContext(CurrentDayContext);
  const { dayActivities, setDayActivities } = useContext(DayActivityContext);

  const [editable, setEditable] = useState(UserService.getLoggedUser() != null);

  useEffect(() => {
    setEditable(UserService.getLoggedUser() != null);
    console.log(editable)
  }, []);

  const handleNameChange = (value) => {
    console.log("teste")
    ActivityService.updateActivity({ ...activity, name: value }).then(_ => updateDayActivities());
  };

  const deleteActivity = () => {
    ActivityService.deleteActivity(activity).then(_ => updateDayActivities());
  };

  const updateDayActivities = () => {
    ActivityService.getByDate(currentDay).then(activities => setDayActivities(activities));
  };

  return (
    <View key={activity.id} className="bg-neutral-100 rounded-lg shadow-sm p-4 m-2">
      <View className="flex flex-row items-center mb-3">
        <TextInput
          className="flex-grow input input-xs pl-2"
          value={activity.name}
          onChangeText={handleNameChange}
          editable={editable}
        />
        <TouchableOpacity onPress={deleteActivity} className="mx-2 w-5">
          <Image
            source={require("src/assets/img/bin.png")}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
      </View>
      <DateProgress startDate={activity.startDate} endDate={activity.endDate} />
    </View>
  );
}
