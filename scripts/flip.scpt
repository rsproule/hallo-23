use AppleScript version "2.4" -- Yosemite (10.10) or later
use scripting additions
use framework "Foundation"

SystemSettings_Mirror_Displays()

on SystemSettings_Mirror_Displays()
    do shell script "open x-apple.systempreferences:com.apple.preference.displays"
    tell application "System Events"
        tell application process "System Settings"
            tell window 1
                repeat until splitter group 1 of group 1 exists
                    delay 0
                end repeat
                tell splitter group 1 of group 1
                    repeat until group 2 exists
                        delay 0
                    end repeat
                    group 2 -- Right hand side of the pane
                    tell group 2
                        tell group 1 -- Contents of the Pane
                            tell scroll area 1 -- Top section - screen selector
                                try
                                    keystroke tab
                                    delay 0.2
                                    keystroke (key code 124)
                                on error errorMessage number errorNumber
                                    if errorNumber is not -1708 then
                                        log ("Error: " & errorMessage & ", Error Number: " & errorNumber)
                                    end if
                                end try
                            end tell
                            tell scroll area 2 -- Lower half of the Pane
                                tell group 1
                                    tell pop up button 1 -- ( Use as... )
                                        perform action "AXPress"
                                        delay 0.2
                                        try
                                            keystroke (key code 125) --Arrow key down
                                            delay 0.2
                                        end try
                                        delay 0.5
                                        try
                                            keystroke (key code 36) --Enter key down
                                        end try
                                    end tell
                                end tell
                            end tell
                        end tell
                    end tell
                end tell
            end tell
        end tell
    end tell
end SystemSettings_Mirror_Displays