# how to make it run

### first unzip the folder and do npm i

### then server will start then you can start quering

# api end points

## /create_storage (POST)

### res we will get the token

## /upload_file (POST)

### in req have to sned the token and file want to upload

## /text_to_audio (POST)

### in req send the token and filename of audio we will get audio file name as response

## /merge/audio_and_image (POST)

### in req send token, audio_file and image_file names with extensions and res we will get the output filename of the video created

## /merge/audio_and_video (POST)

### in req send token, audio_file and video_file names with extensions and res we will get the output filename of the video created

## /merge/merge_videos (POST)

### in req send token, list_of_videos as array in respose we will get the merged file name

## /my_files (GET)

### send the token in the header named as token in respose we will get all the files we created in that bucket

## /download?token={}&file={} (GET)

### send the token and the file name and use in browser we can download the file uploaded

# Thank you

## this work is sololy done by me(Satya Bhagavan Srikakolapu)
