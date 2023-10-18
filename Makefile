launch:;
	make kill
	ffplay -f avfoundation -video_size 1920x1080 -framerate 30 -pixel_format uyvy422 -i "0:none" -window_title "ext" > /dev/null 2>&1 &
	ffplay -f avfoundation -video_size 1920x1080 -framerate 30 -pixel_format uyvy422 -i "1:none" -window_title "int" > /dev/null 2>&1 &

dupe:;
	make killdup
	ffplay -f avfoundation -video_size 1920x1080 -framerate 30 -pixel_format uyvy422 -i "0:none" -window_title "ext-display-dupe" > /dev/null 2>&1 &
	ffplay -f avfoundation -video_size 1920x1080 -framerate 30 -pixel_format uyvy422 -i "1:none" -window_title "int-display-dupe" > /dev/null 2>&1 &

obj:;
	python scripts/obj-detect.py

kill:;
	pkill -f "ffplay" | echo true

killdup:;
	pkill -f "display-dupe" | echo true

flip:; 
	osascript scripts/flip.scpt

fish:;
	scripts/asciiquarium