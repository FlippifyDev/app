import Card from "@/src/components/settings/plans/Card";
import PageTitle from "@/src/components/ui/PageTitle";
import { SubScreenLayout } from "@/src/components/ui/SubScreenLayout";
import { StyleSheet, View } from "react-native";

export default function PlansScreen() {


    return (
        <SubScreenLayout>
            <PageTitle text="Plans" />

            <View style={styles.container}>
                <Card title="Free" description="For beginners" type="free" price={0} />
                <Card title="Standard" description="For growing resellers" type="standard" price={9.99} />
                <Card title="Pro" description="For experts" type="pro" price={19.99} />
                <Card title="Enterprise" description="For large scale operations" type="enterprise 1" price={29.99} />
            </View>
        </SubScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 24,
    }
});
