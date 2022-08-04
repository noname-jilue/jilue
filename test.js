window.app = new PIXI.Application({backgroundAlpha: 0,resizeTo: $0,sharedLoader: true});
$0.appendChild(app.view);
let orb = null;
app.loader
    .add('orb', 'extension/部将/zz/color/img_zz_wn.json')
    .load((loader, res) => {
        orb = new PIXI.spine.Spine(res.orb.spineData);
        const orbCage = new PIXI.Container();
        orbCage.addChild(orb);
        orb.skeleton.setToSetupPose();
        orb.update(0);
        const localRect = orb.getLocalBounds();
        orb.position.set(-localRect.x, -localRect.y);
        const scale = Math.min(
            (app.screen.width * 0.7) / orbCage.width,
            (app.screen.height * 0.7) / orbCage.height,
        );
        orbCage.scale.set(scale, scale);
        orbCage.position.set(
            (app.screen.width - orbCage.width) * 0.5,
            (app.screen.height - orbCage.height) * 0.5,
        );
        app.stage.addChild(orbCage);
        // debugger;
        orb.state.setAnimation(0, 'animation', true); //orb.spineData.animations[0].name
    });