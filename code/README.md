# Tools

I've used the code from this folder to download data and turn it into images.

## Usage

1. Make sure `node` is installed, and run `npm install`. Make sure there are no errors here.
2. Make sure `grib-api` is installed (if you are on mac, then run `brew install grib-api`)
3. Make sure `curl` is installed - we will need it to download data

## Get data

Run:

```
node ./download
```

This would result in ~80-90GB of data being transferred to your computer.

## Turn the data to images

By default, streamlines are rendered at very high resolution. This creates high CPU load,
so be prepared to wait.

Also note, that this task is CPU bound, so if you have multiple CPUs you can edit `scheduler.js`
to set amount of CPUs dedicated to the rendering task, and then run:

```
node scheduler.js
```

This will produce images in the `./out` folder

## Making gif

You can use software of your choice. I prefer to use `imagemagick` and `camtasia`.
