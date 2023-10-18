# Cube head scripts

Cube head is a halloween project for 2023. The costume is a cube head wearable that has 4 external facing LCD monitors (on all external sides of the cube). The monitors can display a couple of different modes. 

1. **Internal camera**: inside of the box there is a camera that points at the human inside the box. From the outside the face of the human is displayed in all 4 directions.
2. **Mirror mode**: there are external cameras that display what they see on the monitors.
3. **Music mode**: display graphics based on the music that is playing

Some of these are achieved by using built in apple tools like Quicktime for reflecting the camera input, hence the heavy use of apple script.

Commands used to control:

Flip between mirroring main display and extending to second monitor:

```bash
make flip
```

launch the ffplay webcam stream

```bash
make launch
```

launch duplicate of the external webcam. not necissary when using mirror mode

```bash
make dupe
```

kill the beast

```bash
make kill
```

kill only the dupes  

```bash
make killdup
```

ascii aquarium (need to install cpan)

```bash
make fish
# if this fails need to first run
cpan Term::Animation
```

## Problems

There is no determinism on which webcam is at which index. so the names are sometimes inverted.