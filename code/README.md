# Tools

I've used the code from this folder to download data and turn it into images.

## Usage

1. Make sure `node.js` is installed. Run `npm install` and check that there are no errors.
2. Make sure `grib-api` is installed (if you are on mac, then run `brew install grib-api`)
3. Make sure `curl` is installed - we will need it to download data

## Get data

Run:

```
node ./download
```

This would result in ~80-90GB of data being transferred to your computer. Takes a while to finish.

## Turn the data to images

By default, streamlines are rendered at very high resolution. This creates high CPU load,
so be prepared to wait. On a powerful MacbookPro, a single image is generated in 3-4 minutes.

Image generation task is CPU bound, so if you have multiple CPUs you can edit `scheduler.js`
to set the amount of CPUs dedicated to the rendering task, and then run:

```
node scheduler.js
```

This will produce images in the `./out` folder.

One way to speed up the process is to change the parameters in the [drawField](https://github.com/anvaka/winvelviz/blob/master/code/drawField.js) file.

## Making gif

You can use software of your choice. I prefer to use `imagemagick` and `camtasia`.
