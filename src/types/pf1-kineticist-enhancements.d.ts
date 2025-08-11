declare global {
    namespace ClientSettings {
        interface Values {
            // Replace with your module ID
            "pf1-kineticist-enhancements": {
                // Replace with your actual setting key and its value shape
                customUtilityTalents: Record<string, unknown>;
            };
        }
    }
}

export {};
