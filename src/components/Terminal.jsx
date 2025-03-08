import React, { useState, useRef, useEffect } from 'react';
import { setAriaLive } from '../utils/accessibility';

const Terminal = () => {
    const [command, setCommand] = useState('');
    const [output, setOutput] = useState([
        'Welcome to the terminal. Type "help" to see available commands.'
    ]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [commandHistory, setCommandHistory] = useState([]);
    
    const inputRef = useRef(null);
    const outputRef = useRef(null);

    useEffect(() => {
        // Focus the input when component mounts
        inputRef.current?.focus();
        
        // Scroll to the bottom when output changes
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    const handleInputChange = (e) => {
        setCommand(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!command.trim()) return;
        
        processCommand(command);
        
        // Add to command history
        setCommandHistory(prev => [command, ...prev].slice(0, 20));
        setHistoryIndex(-1);
        setCommand('');
    };

    const processCommand = (cmd) => {
        let response = '';

        switch (cmd.toLowerCase()) {
            case 'help':
                response = 'Available commands: projects, about, contact, clear';
                break;
            case 'projects':
                response = 'Available projects: Project 1, Project 2, Project 3';
                break;
            case 'about':
                response = 'This is a portfolio website showcasing my work.';
                break;
            case 'contact':
                response = 'You can reach me at myemail@example.com';
                break;
            case 'clear':
                setOutput([]);
                return;
            default:
                response = `Command not recognized: "${cmd}". Type "help" for available commands.`;
        }

        setOutput((prevOutput) => [...prevOutput, `> ${cmd}`, response]);
        setAriaLive(`Command executed: ${cmd}. ${response}`);
    };
    
    const handleKeyDown = (e) => {
        // Handle arrow up/down for command history
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setCommand(commandHistory[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setCommand(commandHistory[newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setCommand('');
            }
        }
    };

    return (
        <div 
            className="terminal bg-black text-green-400 p-4 rounded-md font-mono"
            role="region"
            aria-label="Command terminal interface"
        >
            <div className="terminal-header flex justify-between items-center mb-2 border-b border-gray-700 pb-1">
                <span className="text-sm">Terminal</span>
                <div className="flex space-x-1">
                    <span className="h-3 w-3 rounded-full bg-red-500"></span>
                    <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                </div>
            </div>
            
            <div 
                className="output h-64 overflow-y-auto mb-2 focus:outline-none"
                ref={outputRef}
                tabIndex="0"
                aria-live="polite"
                aria-label="Terminal output"
            >
                {output.map((line, index) => (
                    <div key={index} className={line.startsWith('>') ? 'text-blue-300' : ''}>{line}</div>
                ))}
            </div>
            
            <form onSubmit={handleSubmit} className="input-form flex items-center border-t border-gray-700 pt-2">
                <span className="mr-2">$</span>
                <input
                    type="text"
                    value={command}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a command... (try 'help')"
                    className="terminal-input bg-transparent flex-1 focus:outline-none"
                    aria-label="Command input"
                    ref={inputRef}
                />
                <button 
                    type="submit" 
                    className="bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded"
                    aria-label="Execute command"
                >
                    Run
                </button>
            </form>
        </div>
    );
};

export default Terminal;