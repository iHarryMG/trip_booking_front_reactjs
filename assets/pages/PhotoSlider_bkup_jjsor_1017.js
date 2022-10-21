import React, { useEffect } from 'react'

const PhotoSlider = ({ photoItems }) => {

    const longStyle1 = { position:"relative",margin:"0 auto",top:"0px",left:"0px",width:"980px",height:"520px",overflow:"hidden",visibility:"hidden" }
    const longStyle2 = { position:"absolute",top:"0px",left:"0px",width:"100%",height:"100%",textAlign:"center",backgroundColor:"rgba(0,0,0,0.7)" }
    const longStyle3 = { marginTop:"-19px",position:"relative",top:"50%",width:"38px",height:"38px" }
    const longStyle4 = { cursor:"default",position:"relative",top:"0px",left:"0px",width:"980px",height:"520px",overflow:"hidden" }
    const longStyle5 = { position:"absolute",left:"0px",bottom:"0px",width:"980px",height:"100px",cursor:"default" }
    const longStyle6 = { width:"55px",height:"55px",top:"162px",left:"25px" }
    const longStyle7 = { position:"absolute",top:"0",left:"0",width:"100%",height:"100%" }

    const jssor_1_SlideshowTransitions = [
        {$Duration:800,x:0.3,$During:{$Left:[0.3,0.7]},$Easing:{$Left:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,x:-0.3,$SlideOut:true,$Easing:{$Left:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,x:-0.3,$During:{$Left:[0.3,0.7]},$Easing:{$Left:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,x:0.3,$SlideOut:true,$Easing:{$Left:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,y:0.3,$During:{$Top:[0.3,0.7]},$Easing:{$Top:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,y:-0.3,$SlideOut:true,$Easing:{$Top:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,y:-0.3,$During:{$Top:[0.3,0.7]},$Easing:{$Top:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,y:0.3,$SlideOut:true,$Easing:{$Top:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,x:0.3,$Cols:2,$During:{$Left:[0.3,0.7]},$ChessMode:{$Column:3},$Easing:{$Left:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,x:0.3,$Cols:2,$SlideOut:true,$ChessMode:{$Column:3},$Easing:{$Left:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,y:0.3,$Rows:2,$During:{$Top:[0.3,0.7]},$ChessMode:{$Row:12},$Easing:{$Top:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,y:0.3,$Rows:2,$SlideOut:true,$ChessMode:{$Row:12},$Easing:{$Top:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,y:0.3,$Cols:2,$During:{$Top:[0.3,0.7]},$ChessMode:{$Column:12},$Easing:{$Top:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,y:-0.3,$Cols:2,$SlideOut:true,$ChessMode:{$Column:12},$Easing:{$Top:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,x:0.3,$Rows:2,$During:{$Left:[0.3,0.7]},$ChessMode:{$Row:3},$Easing:{$Left:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,x:-0.3,$Rows:2,$SlideOut:true,$ChessMode:{$Row:3},$Easing:{$Left:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,x:0.3,y:0.3,$Cols:2,$Rows:2,$During:{$Left:[0.3,0.7],$Top:[0.3,0.7]},$ChessMode:{$Column:3,$Row:12},$Easing:{$Left:$Jease$.$InCubic,$Top:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,x:0.3,y:0.3,$Cols:2,$Rows:2,$During:{$Left:[0.3,0.7],$Top:[0.3,0.7]},$SlideOut:true,$ChessMode:{$Column:3,$Row:12},$Easing:{$Left:$Jease$.$InCubic,$Top:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,$Delay:20,$Clip:3,$Assembly:260,$Easing:{$Clip:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,$Delay:20,$Clip:3,$SlideOut:true,$Assembly:260,$Easing:{$Clip:$Jease$.$OutCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,$Delay:20,$Clip:12,$Assembly:260,$Easing:{$Clip:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
        {$Duration:800,$Delay:20,$Clip:12,$SlideOut:true,$Assembly:260,$Easing:{$Clip:$Jease$.$OutCubic,$Opacity:$Jease$.$Linear},$Opacity:2}
    ];

    const jssor_1_options = {
        $AutoPlay: 0,
        $SlideshowOptions: {
            $Class: $JssorSlideshowRunner$,
            $Transitions: jssor_1_SlideshowTransitions,
            $TransitionsOrder: 1
        },
        $ArrowNavigatorOptions: {
            $Class: $JssorArrowNavigator$
        },
        $ThumbnailNavigatorOptions: {
            $Class: $JssorThumbnailNavigator$
        }
    };

    let jssor_1_slider = null;

    useEffect( () => {

        jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);

        ScaleSlider();

        $(window).bind("load", ScaleSlider);
        $(window).bind("resize", ScaleSlider);
        $(window).bind("orientationchange", ScaleSlider);

    }, [photoItems])

    function ScaleSlider() {
        let containerElement = jssor_1_slider.$Elmt.parentNode;
        let containerWidth = containerElement.clientWidth;
        let MAX_WIDTH = 980;

        if (containerWidth) {

            let expectedWidth = Math.min(MAX_WIDTH || containerWidth, containerWidth);

            jssor_1_slider.$ScaleWidth(expectedWidth);
        }
        else {
            window.setTimeout(ScaleSlider, 30);
        }
    }

    return (
        <div id="jssor_1" style={ longStyle1 }>
            {/* Loading Screen */}
            <div data-u="loading" className="jssorl-009-spin" style={ longStyle2 } >
                <img style={ longStyle3 } src={ "/leisure/images/hotel/spin.svg" } />
            </div>
            <div data-u="slides" style={ longStyle4 }>
                { photoItems.map(photoItem =>
                    <div>
                        <img data-u="image" src={ `/leisure/images/hotel/${photoItem.hotel_img}` } />
                        <div data-u="thumb">
                            <img data-u="thumb" src={ `/leisure/images/hotel/${photoItem.hotel_img}` } />
                        </div>
                    </div>
                )}
            </div>
            {/* Thumbnail Navigator */}
            <div data-u="thumbnavigator" className="jssort111" style={ longStyle5 } data-autocenter="1" data-scale-bottom="0.75">
                <div data-u="slides">
                    <div data-u="prototype" className="p">
                        <div data-u="thumbnailtemplate" className="t"></div>
                    </div>
                </div>
            </div>
            {/* Arrow Navigator */}
            <div data-u="arrowleft" className="jssora051" style={ longStyle6 } data-autocenter="2" data-scale="0.75" data-scale-left="0.75">
                <svg viewBox="0 0 16000 16000" style={ longStyle7 }>
                    <polyline className="a" points="11040,1920 4960,8000 11040,14080 "></polyline>
                </svg>
            </div>
            <div data-u="arrowright" className="jssora051" style={{ width:"55px",height:"55px",top:"162px",right:"25px" }} data-autocenter="2" data-scale="0.75" data-scale-right="0.75" >
                <svg viewBox="0 0 16000 16000" style={{ position:"absolute",top:"0",left:"0",width:"100%",height:"100%" }} >
                    <polyline className="a" points="4960,1920 11040,8000 4960,14080 "></polyline>
                </svg>
            </div>
        </div>
    )
}

export default PhotoSlider