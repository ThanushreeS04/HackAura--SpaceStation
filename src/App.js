import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const silenceTimerRef = useRef(null);

  // Text-to-Speech function
  const speak = React.useCallback((text) => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  }, []);

  // Process voice commands and generate responses
  const processCommand = React.useCallback((command) => {
    const cmd = command.toLowerCase().trim();
    let response = '';
    
    // Navigation commands
    if (cmd.includes('dashboard') || cmd.includes('home') || cmd.includes('main screen')) {
      setCurrentPage('dashboard');
      response = 'Navigating to mission dashboard. All critical systems are operational and within normal parameters.';
    } 
    else if (cmd.includes('system status') || cmd.includes('systems') || cmd.includes('check systems')) {
      setCurrentPage('system');
      response = 'Displaying comprehensive system status. Life support nominal, navigation locked on target, communication signal at 85 percent strength.';
    } 
    else if (cmd.includes('task') || cmd.includes('tasks') || cmd.includes('to do')) {
      setCurrentPage('tasks');
      response = 'Opening task manager. You have one completed task, one in progress, and one pending. Would you like details?';
    } 
    else if (cmd.includes('procedure') || cmd.includes('emergency procedure') || cmd.includes('protocol')) {
      setCurrentPage('procedures');
      response = 'Displaying emergency procedures. All safety protocols are ready for immediate activation if needed.';
    } 
    else if (cmd.includes('assessment') || cmd.includes('situation') || cmd.includes('status report')) {
      setCurrentPage('assessment');
      response = 'Situation assessment complete. Mission status is nominal, all crew members are healthy, no anomalies detected.';
    }
    
    // Detailed Information queries
    else if (cmd.includes('oxygen') || cmd.includes('o2') || cmd.includes('air')) {
      response = 'Oxygen levels are at 98.5 percent. Life support systems are functioning normally. Air quality is excellent with optimal CO2 scrubbing.';
    }
    else if (cmd.includes('power') || cmd.includes('battery') || cmd.includes('energy')) {
      response = 'Power status is at 100 percent. Solar panels are generating maximum output. All energy systems are fully charged and operational.';
    }
    else if (cmd.includes('temperature') || cmd.includes('temp') || cmd.includes('climate')) {
      response = 'Current temperature is 22 degrees Celsius. Climate control is maintaining optimal conditions throughout all modules.';
    }
    else if (cmd.includes('pressure') || cmd.includes('atmospheric')) {
      response = 'Atmospheric pressure is stable at 101.3 kilopascals. All seals are intact and pressure is within nominal range.';
    }
    else if (cmd.includes('communication') || cmd.includes('comms') || cmd.includes('signal')) {
      response = 'Communication systems are online. Signal strength to ground control is at 85 percent. All channels are clear.';
    }
    else if (cmd.includes('navigation') || cmd.includes('position') || cmd.includes('location')) {
      response = 'Navigation systems are locked and tracking. Current orbital position is nominal. All guidance systems are functioning perfectly.';
    }
    
    // Time and date queries
    else if (cmd.includes('time') || cmd.includes('what time')) {
      const now = new Date();
      response = `Current mission time is ${now.toLocaleTimeString()}. All chronometers are synchronized.`;
    }
    else if (cmd.includes('date') || cmd.includes('what day') || cmd.includes('today')) {
      const now = new Date();
      response = `Today is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. Mission day in progress.`;
    }
    
    // Status checks
    else if (cmd.includes('all systems') || cmd.includes('full status') || cmd.includes('everything ok')) {
      response = 'Running full diagnostic. All systems nominal. Life support at 98.5%, power at 100%, temperature optimal, communications active. Station is operating within all safety parameters.';
    }
    else if (cmd.includes('crew') || cmd.includes('health') || cmd.includes('medical')) {
      response = 'All crew members are in excellent health. Vital signs are within normal range. No medical concerns detected.';
    }
    else if (cmd.includes('warning') || cmd.includes('alerts') || cmd.includes('problems')) {
      response = 'No active warnings or alerts. All systems are green. Station is operating normally with no anomalies detected.';
    }
    
    // Actions
    else if (cmd.includes('emergency') || cmd.includes('alert') || cmd.includes('mayday')) {
      response = 'EMERGENCY PROTOCOL ACTIVATED! Initiating safety procedures. All crew to emergency stations. Please remain calm and follow evacuation protocols immediately.';
    }
    else if (cmd.includes('lights on') || cmd.includes('turn on lights')) {
      response = 'Activating main lighting systems. Illumination set to 100 percent across all modules.';
    }
    else if (cmd.includes('lights off') || cmd.includes('turn off lights')) {
      response = 'Dimming main lighting systems. Switching to night mode with emergency lighting only.';
    }
    else if (cmd.includes('lock') || cmd.includes('secure')) {
      response = 'Engaging security protocols. All airlocks and hatches are now secured. Station is in lockdown mode.';
    }
    else if (cmd.includes('unlock') || cmd.includes('unsecure')) {
      response = 'Disengaging security protocols. All airlocks and hatches are now accessible. Lockdown lifted.';
    }
    
    // Information requests
    else if (cmd.includes('mission') || cmd.includes('objective')) {
      response = 'Current mission objective is to maintain station operations and conduct scientific research. All mission parameters are on schedule.';
    }
    else if (cmd.includes('weather') || cmd.includes('conditions')) {
      response = 'External conditions: Solar activity is normal, no debris threats detected. Space weather is favorable for all operations.';
    }
    else if (cmd.includes('fuel') || cmd.includes('propellant')) {
      response = 'Propellant reserves are at optimal levels. Sufficient fuel for all planned maneuvers and emergency procedures.';
    }
    
    // Help and guidance
    else if (cmd.includes('help') || cmd.includes('what can you do') || cmd.includes('commands')) {
      response = 'I can navigate the station, check all systems, monitor oxygen, power, temperature, pressure, communications, and crew health. I can activate emergency protocols, control lighting, and provide mission updates. Try asking about any system or saying emergency for alerts!';
    }
    else if (cmd.includes('repeat') || cmd.includes('say that again')) {
      response = assistantResponse || 'I have not said anything yet. How can I help you?';
    }
    
    // Greetings and social
    else if (cmd.includes('hello') || cmd.includes('hi ') || cmd === 'hi' || cmd.includes('hey')) {
      const greetings = [
        'Hello astronaut! All systems are ready. How can I assist you today?',
        'Greetings! Station systems are nominal. What do you need?',
        'Hello! I am here to help. What can I do for you?'
      ];
      response = greetings[Math.floor(Math.random() * greetings.length)];
    }
    else if (cmd.includes('good morning')) {
      response = 'Good morning astronaut! All systems are operational. Ready to start the day. Coffee is brewing in the galley!';
    }
    else if (cmd.includes('good night') || cmd.includes('goodnight')) {
      response = 'Good night astronaut. All systems will continue monitoring while you rest. Sleep well, I will alert you if anything requires attention.';
    }
    else if (cmd.includes('how are you')) {
      response = 'All my systems are functioning perfectly at 100 percent efficiency. How can I help you today?';
    }
    else if (cmd.includes('thank you') || cmd.includes('thanks')) {
      response = 'You are very welcome! I am always here to assist. Let me know if you need anything else.';
    }
    else if (cmd.includes('good job') || cmd.includes('well done') || cmd.includes('great')) {
      response = 'Thank you! I am here to serve. Your mission success is my priority.';
    }
    else if (cmd.includes('joke') || cmd.includes('tell me a joke')) {
      const jokes = [
        'Why did the astronaut break up with his girlfriend? He needed space!',
        'How do you organize a space party? You planet!',
        'Why did the sun go to school? To get brighter!',
        'What do you call a tick on the moon? A luna-tick!',
        'How does the solar system hold up its pants? With an asteroid belt!'
      ];
      response = jokes[Math.floor(Math.random() * jokes.length)];
    }
    
    // More Questions & Queries
    else if (cmd.includes('who are you') || cmd.includes('what are you')) {
      response = 'I am your station AI assistant. I monitor all systems, provide information, and help ensure mission success. Think of me as your digital co-pilot!';
    }
    else if (cmd.includes('where am i') || cmd.includes('where are we')) {
      response = 'You are aboard the StarCommand Space Station, currently in low Earth orbit at approximately 400 kilometers altitude, traveling at 28,000 kilometers per hour.';
    }
    else if (cmd.includes('how fast') || cmd.includes('speed')) {
      response = 'The station is traveling at approximately 28,000 kilometers per hour, or 7.66 kilometers per second. We complete one orbit around Earth every 90 minutes.';
    }
    else if (cmd.includes('how high') || cmd.includes('altitude')) {
      response = 'Current altitude is approximately 400 kilometers above Earth surface. We maintain a stable low Earth orbit.';
    }
    else if (cmd.includes('how long') || cmd.includes('mission duration')) {
      response = 'Current mission has been ongoing for 47 days. Planned mission duration is 180 days. You are making excellent progress!';
    }
    else if (cmd.includes('earth') || cmd.includes('see earth') || cmd.includes('view')) {
      response = 'Earth is visible through the observation window. Current view shows the Pacific Ocean with scattered cloud formations. Absolutely beautiful!';
    }
    else if (cmd.includes('stars') || cmd.includes('see stars')) {
      response = 'The star field is magnificent from here. Without atmospheric interference, you can see thousands of stars with perfect clarity. Truly breathtaking!';
    }
    else if (cmd.includes('moon') || cmd.includes('see moon')) {
      response = 'The Moon is currently visible in its waxing gibbous phase. Distance from station is approximately 384,000 kilometers.';
    }
    else if (cmd.includes('sun') || cmd.includes('solar')) {
      response = 'The Sun is currently visible. Solar radiation levels are normal. All solar panels are operating at maximum efficiency.';
    }
    else if (cmd.includes('radiation') || cmd.includes('exposure')) {
      response = 'Radiation levels are within safe limits. Shielding is effective. Cumulative exposure is well below maximum allowable dose.';
    }
    else if (cmd.includes('water') || cmd.includes('h2o')) {
      response = 'Water reserves are at 95 percent capacity. Recycling systems are functioning perfectly. All water quality parameters are nominal.';
    }
    else if (cmd.includes('food') || cmd.includes('supplies')) {
      response = 'Food supplies are adequate for 120 more days. Nutritional balance is maintained. All provisions are properly stored.';
    }
    else if (cmd.includes('sleep') || cmd.includes('rest')) {
      response = 'Recommended sleep period is 8 hours. Sleep quarters are ready. Would you like me to dim the lights and reduce noise levels?';
    }
    else if (cmd.includes('exercise') || cmd.includes('workout')) {
      response = 'Daily exercise is important in microgravity. Treadmill and resistance equipment are available. Recommended workout duration is 2 hours.';
    }
    else if (cmd.includes('experiment') || cmd.includes('research') || cmd.includes('science')) {
      response = 'Three active experiments are currently running. All research equipment is functioning normally. Data collection is proceeding as scheduled.';
    }
    else if (cmd.includes('contact') || cmd.includes('call') || cmd.includes('message')) {
      response = 'Communication window with ground control opens in 15 minutes. Would you like me to prepare a status report?';
    }
    else if (cmd.includes('spacewalk') || cmd.includes('eva')) {
      response = 'No spacewalks are currently scheduled. All EVA equipment is stowed and ready. External maintenance is not required at this time.';
    }
    else if (cmd.includes('docking') || cmd.includes('arrival') || cmd.includes('departure')) {
      response = 'No docking operations scheduled for the next 72 hours. All docking ports are secure and available.';
    }
    else if (cmd.includes('orbit') || cmd.includes('trajectory')) {
      response = 'Orbital parameters are nominal. No course corrections needed. Station is maintaining stable orbit with minimal drift.';
    }
    else if (cmd.includes('gravity') || cmd.includes('microgravity')) {
      response = 'Station is in microgravity environment. Effective gravity is approximately 0.00001 g. All systems are designed for zero-g operations.';
    }
    else if (cmd.includes('toilet') || cmd.includes('bathroom') || cmd.includes('waste')) {
      response = 'Waste management systems are functioning normally. All facilities are operational and sanitized.';
    }
    else if (cmd.includes('shower') || cmd.includes('hygiene')) {
      response = 'Water recycling shower is available. Please limit shower duration to 5 minutes to conserve water resources.';
    }
    else if (cmd.includes('music') || cmd.includes('play music')) {
      response = 'Accessing entertainment library. I can play classical, rock, jazz, or ambient space music. What would you prefer?';
    }
    else if (cmd.includes('movie') || cmd.includes('video')) {
      response = 'Video library contains over 500 movies and shows. Entertainment system is ready. Enjoy your downtime!';
    }
    else if (cmd.includes('family') || cmd.includes('home')) {
      response = 'Video call system is available for personal communications. Your family is very proud of your mission. Stay strong!';
    }
    else if (cmd.includes('scared') || cmd.includes('afraid') || cmd.includes('worried')) {
      response = 'You are doing an amazing job. All systems are protecting you. You are safe, well-trained, and mission control is always monitoring. You have got this!';
    }
    else if (cmd.includes('lonely') || cmd.includes('alone')) {
      response = 'I am always here with you. Ground control is monitoring. Your crew mates are nearby. You are never truly alone. We are all in this together!';
    }
    else if (cmd.includes('beautiful') || cmd.includes('amazing') || cmd.includes('incredible')) {
      response = 'The view from space truly is incredible. You are experiencing something very few humans ever will. Enjoy every moment!';
    }
    
    // AI & Object Detection System
    else if (cmd.includes('detect') || cmd.includes('detection') || cmd.includes('scan')) {
      response = 'AI object detection system is active. Currently monitoring for oxygen tanks, nitrogen tanks, first aid kits, fire alarms, safety panels, emergency phones, and fire extinguishers. All safety objects are being tracked.';
    }
    else if (cmd.includes('oxygen tank') || cmd.includes('o2 tank')) {
      response = 'Oxygen tank detected and tracked. Location verified. Tank pressure is nominal. All oxygen storage units are secure and monitored.';
    }
    else if (cmd.includes('nitrogen tank') || cmd.includes('n2 tank')) {
      response = 'Nitrogen tank detected and tracked. Pressure levels normal. All nitrogen storage is secure and within safety parameters.';
    }
    else if (cmd.includes('first aid') || cmd.includes('medical kit')) {
      response = 'First aid kit located and accessible. All medical supplies are stocked and within expiration dates. Emergency medical equipment is ready.';
    }
    else if (cmd.includes('fire alarm') || cmd.includes('smoke detector')) {
      response = 'Fire alarm systems are operational. All smoke detectors are functioning. No fire alerts detected. Safety systems are on standby.';
    }
    else if (cmd.includes('safety panel') || cmd.includes('control panel')) {
      response = 'Safety switch panel is accessible and operational. All emergency controls are functional. Manual override systems are ready.';
    }
    else if (cmd.includes('emergency phone') || cmd.includes('intercom')) {
      response = 'Emergency phone system is operational. Direct line to ground control is available. Communication channels are clear and ready.';
    }
    else if (cmd.includes('fire extinguisher') || cmd.includes('extinguisher')) {
      response = 'Fire extinguisher located and accessible. Pressure gauge shows full charge. All fire suppression equipment is ready for immediate use.';
    }
    else if (cmd.includes('safety objects') || cmd.includes('safety equipment')) {
      response = 'All safety objects detected: 2 oxygen tanks, 1 nitrogen tank, 3 first aid kits, 4 fire alarms, 2 safety panels, 1 emergency phone, and 3 fire extinguishers. All equipment is accounted for and operational.';
    }
    else if (cmd.includes('camera') || cmd.includes('vision') || cmd.includes('visual')) {
      response = 'AI vision system is active. Cameras are monitoring all modules. Object recognition is running at 98 percent accuracy. All safety equipment is being tracked in real-time.';
    }
    else if (cmd.includes('ai system') || cmd.includes('artificial intelligence')) {
      response = 'AI systems are fully operational. Running object detection, anomaly detection, and predictive maintenance algorithms. All neural networks are functioning at optimal performance.';
    }
    else if (cmd.includes('anomaly') || cmd.includes('unusual') || cmd.includes('strange')) {
      response = 'No anomalies detected. All systems are operating within normal parameters. AI monitoring has not flagged any unusual activity or objects.';
    }
    else if (cmd.includes('hidden objects') || cmd.includes('obscured')) {
      response = 'Scanning for partially hidden or obscured objects. AI is analyzing unusual angles and lighting conditions. All critical safety equipment has been located and verified.';
    }
    else if (cmd.includes('lighting') || cmd.includes('brightness') || cmd.includes('visibility')) {
      response = 'Lighting conditions are optimal for object detection. AI is compensating for varying brightness levels. All cameras have clear visibility across all modules.';
    }
    else if (cmd.includes('tracking') || cmd.includes('monitor objects')) {
      response = 'Real-time object tracking is active. All safety equipment locations are being continuously monitored. Movement detection is enabled for floating objects in microgravity.';
    }
    else if (cmd.includes('safety check') || cmd.includes('safety inspection')) {
      response = 'Initiating comprehensive safety inspection. Scanning all modules for required safety equipment. All oxygen tanks, fire extinguishers, first aid kits, and emergency systems are present and functional.';
    }
    else if (cmd.includes('missing') || cmd.includes('lost') || cmd.includes('cannot find')) {
      response = 'Initiating search protocol. AI cameras are scanning all areas. What object are you looking for? I can help locate any safety equipment or personal items.';
    }
    else if (cmd.includes('floating') || cmd.includes('loose objects')) {
      response = 'Scanning for loose floating objects. In microgravity, all items must be secured. AI has detected 3 loose items: 1 pen, 1 tablet, and 1 water pouch. Please secure these objects.';
    }
    else if (cmd.includes('hazard') || cmd.includes('danger') || cmd.includes('risk')) {
      response = 'Hazard assessment complete. No immediate dangers detected. All safety equipment is accessible. Fire suppression systems are ready. Emergency protocols are on standby.';
    }
    
    // Default
    else {
      response = 'I did not understand that command. Try saying help to see all available commands, or ask me about systems, oxygen, power, temperature, navigation, or anything else about the station!';
    }
    
    return response;
  }, [assistantResponse]);

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3;

      recognition.onresult = (event) => {
        // Clear any existing silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Show interim results
        if (interimTranscript) {
          setTranscript(interimTranscript);
        }
        
        // Process final results
        if (finalTranscript) {
          setTranscript(finalTranscript);
          
          // Set a timer to process after 2 seconds of silence
          silenceTimerRef.current = setTimeout(() => {
            // Process command and get response
            const response = processCommand(finalTranscript);
            setAssistantResponse(response);
            
            // Add to conversation history
            setConversationHistory(prev => [
              ...prev,
              { type: 'user', text: finalTranscript },
              { type: 'assistant', text: response }
            ]);
            
            // Speak the response
            speak(response);
            
            // Stop listening after processing
            recognitionRef.current?.stop();
            
            // Clear transcript after 5 seconds
            setTimeout(() => setTranscript(''), 5000);
          }, 2000);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          setAssistantResponse('I did not hear anything. Please try again.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [processCommand, speak]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setAssistantResponse('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Manual command trigger (for testing or button clicks)
  const triggerCommand = (commandText) => {
    setTranscript(commandText);
    const response = processCommand(commandText);
    setAssistantResponse(response);
    
    setConversationHistory(prev => [
      ...prev,
      { type: 'user', text: commandText },
      { type: 'assistant', text: response }
    ]);
    
    speak(response);
    setTimeout(() => setTranscript(''), 5000);
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '⏰' },
    { id: 'system', label: 'System Status', icon: '⚡' },
    { id: 'tasks', label: 'Task Manager', icon: '📋' },
    { id: 'procedures', label: 'Procedures', icon: '📖' },
    { id: 'assessment', label: 'Situation Assessment', icon: '💡' }
  ];

  return (
    <div className="min-h-screen bg-space-blue flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-space-blue border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-space-light-blue text-2xl">⭐</span>
            <h1 className="text-white text-xl font-bold">StarCommand</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    currentPage === item.id
                      ? 'bg-space-light-blue text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <span className="text-white text-sm">Astronaut</span>
          </div>
          <div className="space-y-2">
            <button 
              onClick={() => triggerCommand('emergency')}
              className="w-full bg-space-red hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-lg"
            >
              <span className="text-lg">⚠️</span>
              <span>Emergency</span>
            </button>
            <button 
              onClick={() => triggerCommand('safety check')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm"
            >
              <span>🔍</span>
              <span>Safety Scan</span>
            </button>
            <button 
              onClick={() => triggerCommand('all systems')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm"
            >
              <span>✓</span>
              <span>Full Status</span>
            </button>
            <button 
              onClick={() => triggerCommand('tell me a joke')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm"
            >
              <span>😄</span>
              <span>Tell Joke</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-space-blue relative">
        {/* Content based on current page */}
        <div className="p-8">
          {currentPage === 'dashboard' && (
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-6">Mission Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Oxygen Levels</h3>
                  <p className="text-3xl font-bold text-green-400">98.5%</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Power Status</h3>
                  <p className="text-3xl font-bold text-green-400">100%</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Temperature</h3>
                  <p className="text-3xl font-bold text-blue-400">22°C</p>
                </div>
              </div>
            </div>
          )}

          {currentPage === 'system' && (
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-6">System Status</h2>
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-400 mb-1">Life Support Systems</h3>
                  <p className="text-gray-300">All systems operational</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-400 mb-1">Navigation</h3>
                  <p className="text-gray-300">GPS locked, trajectory nominal</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-1">Communication</h3>
                  <p className="text-gray-300">Signal strength: 85%</p>
                </div>
              </div>
            </div>
          )}

          {currentPage === 'tasks' && (
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-6">Task Manager</h2>
              <div className="space-y-3">
                <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                  <span>Daily system check</span>
                  <span className="text-green-400">✓ Completed</span>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                  <span>Exercise routine</span>
                  <span className="text-yellow-400">⏳ In Progress</span>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                  <span>Research data collection</span>
                  <span className="text-gray-400">⏸️ Pending</span>
                </div>
              </div>
            </div>
          )}

          {currentPage === 'procedures' && (
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-6">Emergency Procedures</h2>
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-400 mb-1">Emergency Evacuation</h3>
                  <p className="text-gray-300">Protocol 7-2-1: Immediate evacuation to escape pod</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-1">System Failure</h3>
                  <p className="text-gray-300">Protocol 3-1-4: Manual override procedures</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-400 mb-1">Medical Emergency</h3>
                  <p className="text-gray-300">Protocol 9-1-1: Contact medical bay immediately</p>
                </div>
              </div>
            </div>
          )}

          {currentPage === 'assessment' && (
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-6">Situation Assessment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Mission Status</h3>
                  <p className="text-green-400 text-lg mb-2">All systems nominal</p>
                  <p className="text-gray-300">No critical issues detected</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Crew Status</h3>
                  <p className="text-green-400 text-lg mb-2">All crew members healthy</p>
                  <p className="text-gray-300">Vital signs within normal range</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Voice Assistant Panel */}
        <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-4">
          {/* Conversation History */}
          {conversationHistory.length > 0 && (
            <div className="bg-gray-900 bg-opacity-95 rounded-lg p-4 max-w-md max-h-96 overflow-y-auto shadow-2xl border border-gray-700">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <span>🤖</span>
                  <span>Voice Assistant</span>
                </h3>
                <button 
                  onClick={() => setConversationHistory([])}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-3">
                {conversationHistory.slice(-6).map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.type === 'user' 
                        ? 'bg-space-light-blue text-white' 
                        : 'bg-gray-800 text-gray-200'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Interaction */}
          {(transcript || assistantResponse) && (
            <div className="bg-gray-800 text-white p-4 rounded-lg max-w-md shadow-xl border border-gray-700">
              {transcript && (
                <div className="mb-2">
                  <p className="text-xs text-gray-400 mb-1">You said:</p>
                  <p className="text-sm font-medium">{transcript}</p>
                </div>
              )}
              {assistantResponse && (
                <div className={transcript ? 'mt-3 pt-3 border-t border-gray-700' : ''}>
                  <p className="text-xs text-gray-400 mb-1">Assistant:</p>
                  <p className="text-sm">{assistantResponse}</p>
                </div>
              )}
            </div>
          )}

          {/* Voice Button */}
          <button
            onClick={toggleListening}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              isListening
                ? 'bg-space-red animate-pulse scale-110'
                : isSpeaking
                ? 'bg-green-500 animate-pulse'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice command'}
          >
            <span className="text-white text-2xl">
              {isListening ? '🎤' : isSpeaking ? '🔊' : '🎤'}
            </span>
          </button>
        </div>

        {/* Voice Status Indicator */}
        {isListening && (
          <div className="fixed top-4 right-4 bg-space-red text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span className="font-medium">Listening for command...</span>
          </div>
        )}

        {isSpeaking && !isListening && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg">
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
            <span className="font-medium">Assistant speaking...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
