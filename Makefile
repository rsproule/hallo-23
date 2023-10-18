# internal:;
# 	osascript scripts/internal.scpt

# external:;
# 	osascript scripts/external.scpt

launch:;
	ffplay -f avfoundation -video_size 1920x1080 -framerate 30 -pixel_format uyvy422 -i "0:none" -window_title "ext" > /dev/null 2>&1 &
	ffplay -f avfoundation -video_size 1920x1080 -framerate 30 -pixel_format uyvy422 -i "1:none" -window_title "int" > /dev/null 2>&1 &

ext:;
	ffplay -f avfoundation -video_size 1920x1080 -framerate 30 -pixel_format uyvy422 -i "0:none" -window_title "ext-dupe" > /dev/null 2>&1 &

int:;
	ffplay -f avfoundation -video_size 1920x1080 -framerate 30 -pixel_format uyvy422 -i "1:none" > /dev/null 2>&1 &

kill:;
	pkill -f "ffplay" | echo true

flip:; 
	osascript scripts/flip.scpt

