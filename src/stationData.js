// src/stationData.js

export const STATION_INVENTORY = {
    // 🌟 MUST MATCH YOLO OUTPUT EXACTLY!
    "NitrogenTank": { 
        display_name: "Nitrogen Tank",
        location: "Aft Equipment Module, Section 3B, Upper Rack.",
        access_procedure: [
            "Procedure N2-ACC-001: Nitrogen Tank Access",
            "1. Verify pressure reading on System Status.",
            "2. Unlock safety cage latch (Code 44B68C).",
            "3. Use wrench size 12 to loosen valve shield."
        ],
        keywords: ["nitrogen", "n2", "tank","nitrogentank","nitrogen tank"],
        menu_link: "system"
    },
    
    "OxygenTank": {
        display_name: "Oxygen Tank",
        location: "Forward Resource Module, Bay 1, Lower Deck.",
        access_procedure: [
            "Procedure O2-CHECK-002: Oxygen Tank Status Check",
            "1. Access Life Support tab on System Status.",
            "2. Confirm flow rate is 0.5 liters/minute."
        ],
        keywords: ["oxygen", "o2", "air supply","OxygenTank","oxygen tank"],
        menu_link: "system"
    },
    
    "FireAlarm": {
        display_name: "Fire Alarm Unit",
        location: "Central Corridor, near Section 4D.",
        access_procedure: [
            "Protocol FIRE-001: Fire Alarm Reset",
            "1. Confirm fire source is contained.",
            "2. Press the manual reset button.",
            "3. Report status to Mission Control."
        ],
        keywords: ["fire", "smoke", "alarm",'FireAlarm','fire alarm'],
        menu_link: "procedures"
    },

    "EmergencyPhone": {
        display_name: "Emergency Phone",
        location: "Airlock 2, Safety Console.",
        access_procedure: [
            "Protocol COM-999: Emergency Contact Procedure",
            "1. Lift handset and press the red button.",
            "2. Wait for automatic connection to Mission Control."
        ],
        keywords: ["emergency", "phone", "call", "comms",'emergenccy phone','emergency call'],
        menu_link: "procedures"
    },
    
    "FirstAidBox": {
        display_name: "First Aid Box",
        location: "Medical Bay, Aft bulkhead, near hatch 2.",
        access_procedure: [
            "Procedure MED-001: First Aid Box Access",
            "1. Unlock panel using keycard.",
            "2. Select required medical supply.",
            "3. Report usage to Task Manager."
        ],
        keywords: ["first aid", "medical", "aid", "kit", "box","firstaidbox","first aid box"],
        menu_link: "procedures"
    }
};