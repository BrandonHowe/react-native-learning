import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
    // eslint-disable-next-line import/namespace
} from "react-native";

interface TodoItem {
    text: string;
    completed: boolean;
}

interface StateData {
    todoItems: TodoItem[];
    pans: Animated.Value[];
    setTodoItems: (val: TodoItem[]) => void;
    setPans: (val: Animated.Value[]) => void;
}

const todoItem = (
    data: TodoItem,
    stateData: StateData,
    pan: Animated.Value,
    index: number
) => {
    console.log(data, index);

    const updateCompleted = (index: number) => {
        console.log(stateData.todoItems, index);
        const clonedTodoItems = [...stateData.todoItems];
        clonedTodoItems[index] = {
            ...stateData.todoItems[index],
            completed: !stateData.todoItems[index].completed
        };
        stateData.setTodoItems(clonedTodoItems);
    };

    const deleteItem = () => {
        Animated.sequence([
            Animated.timing(pan, {
                toValue: -Dimensions.get("window").width,
                duration: 300,
                useNativeDriver: true
            })
        ]).start(({ finished }) => {
            if (finished) {
                const clonedTodoItems = [...stateData.todoItems];
                clonedTodoItems.splice(index, 1);
                stateData.setTodoItems(clonedTodoItems);
                const clonedPans = [...stateData.pans];
                clonedPans.splice(index, 1);
                stateData.setPans(clonedPans);
            }
        });
    };

    return (
        <Animated.View
            style={{
                transform: [
                    {
                        translateX: pan
                    },
                    { translateY: 0 }
                ]
            }}
            key={`item${index}`}
        >
            <Text
                style={[
                    styles.todoItem,
                    {
                        textDecorationLine: data.completed
                            ? "line-through"
                            : "none"
                    }
                ]}
                onPress={() => updateCompleted(index)}
            >
                {data.text}
                <Pressable onPress={deleteItem} style={styles.deleteButton}>
                    <Text
                        style={{
                            textAlign: "center",
                            lineHeight: 20
                        }}
                    >
                        &times;
                    </Text>
                </Pressable>
            </Text>
        </Animated.View>
    );
};

export default () => {
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
    const [pans, setPans] = useState<Animated.Value[]>([]);

    const [inputVal, setInputVal] = useState<string>("");

    useEffect(() => {
        console.log("rendering", todoItems);
    });

    const handleSubmit = () => {
        setTodoItems([...todoItems, { text: inputVal, completed: false }]);
        setPans([...pans, new Animated.Value(0)]);
        setInputVal("");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Todo app</Text>
            <View
                style={{
                    flexDirection: "row",
                    height: 80,
                    padding: 20
                }}
            >
                <TextInput
                    style={styles.textInput}
                    onChangeText={setInputVal}
                    value={inputVal}
                />
                <Pressable onPress={handleSubmit} style={styles.addButton}>
                    <Text
                        style={{
                            textAlign: "center",
                            lineHeight: 40
                        }}
                    >
                        Add
                    </Text>
                </Pressable>
            </View>
            <ScrollView>
                {todoItems.map((l, idx) =>
                    todoItem(
                        l,
                        { todoItems, setTodoItems, pans, setPans },
                        pans[idx],
                        idx
                    )
                )}
            </ScrollView>
            <StatusBar style="auto" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    title: {
        textAlign: "center",
        marginTop: 16,
        marginBottom: 16,
        fontSize: 48
    },
    todoItem: {
        height: 60,
        lineHeight: 20,
        marginLeft: 20,
        marginRight: 20,
        paddingBottom: 20,
        paddingTop: 20,
        paddingLeft: 10,
        borderTopColor: "#F3F3F3",
        borderTopWidth: 2,
        textAlign: "left"
    },
    textInput: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        padding: 10,
        width: Dimensions.get("window").width - 100
    },
    addButton: {
        width: 50,
        height: 40,
        marginLeft: 10,
        backgroundColor: "#CCC",
        borderRadius: 5
    },
    deleteButton: {
        width: 80,
        height: 20,
        float: "right"
    }
});
