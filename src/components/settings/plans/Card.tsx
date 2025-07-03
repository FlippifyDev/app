import { SubscriptionType } from '@/src/models/store-data';
import { Colors } from '@/src/theme/colors';
import { Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Purchases from 'react-native-purchases';

const apiKey = process.env.PUBLIC_API_KEY_REVENUE_CAT ?? "";
Purchases.configure({ apiKey });

interface Props {
    title: string;
    description: string;
    price: number;
    type: SubscriptionType
}
const Card: React.FC<Props> = ({ title, description, type, price }) => {
    /** 
    const user = useUser();
    const currentSubscription = user?.authentication?.subscribed;
    const [availablePackages, setAvailablePackages] = useState<any[]>([]);
    const [currentOffering, setCurrentOffering] = useState<any>(null);

    console.log(availablePackages)

    async function handleViewMembership() {
        await WebBrowser.openBrowserAsync("https://flippify.io/l/login")
    }

    useEffect(() => {
        const fetchOffering = async () => {
            try {
                const offerings = await Purchases.getOfferings();
                const offering = offerings.current;
                setCurrentOffering(offering);
                if (offering) {
                    const packages = offering.availablePackages.filter((pkg: any) =>
                        pkg.product.identifier.includes(type)
                    );
                    setAvailablePackages(packages);
                }
            } catch (error) {
                console.error('Error fetching offerings:', error);
            }
        };

        fetchOffering();
    }, [type]);


    async function handlePurchase(pkg: any) {
        try {
            const { customerInfo } = await Purchases.purchasePackage(pkg);
            const entitlement = Object.keys(customerInfo.entitlements.active).find((key) =>
                key.includes(type)
            );
            if (entitlement) {
                // Send request to https://flippify.io/api/add-subscription
            }
        } catch (e) {
            if (!e.userCancelled) {
                console.error('Purchase error:', e);
            }
        }
    };

                {currentSubscription?.includes(type) ? (
                <FButton title="View Membership" onPress={handleViewMembership} />
            ) : (
                <FButton title="Get Started" onPress={handlePurchase} />
            )}
    */
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>

                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{price !== 0 ? `$${price.toFixed(2)}` : "Free"}</Text>
                </View>
            </View>


        </View>
    )
}

export default Card


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 12,
        marginVertical: 6,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'visible',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    titleContainer: {
        alignItems: "center"
    },
    title: {
        color: Colors.text,
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 10
    },
    description: {
        color: Colors.textSecondary,
        fontSize: 14
    },
    priceContainer: {
        padding: 12,
        marginTop: 10
    },
    price: {
        color: Colors.text,
        fontWeight: "bold",
        fontSize: 32
    }
});
