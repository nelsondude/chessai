var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, HostListener, Input, Renderer2, ViewChild } from '@angular/core';
import { Vector3 } from 'three';
import { ChessService } from '../../services/chess.service';
import { IoService } from '../../services/io.service';
import { Coor, Pos } from '../../globals/classes';
import DragControlsAdv from 'drag-controls-adv';
var OrbitControls = require('three-orbit-controls')(THREE);
var ObjLoader = require('three-obj-loader')(THREE);
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import * as _ from 'underscore';
import { BsModalService } from 'ngx-bootstrap';
import { Ng2DeviceService } from 'ng2-device-detector';
// Axis Orientation
//    Y
//    |
//    |
//    |_______ X
//   / Board goes here
//  /
// Z
var ChessboardComponent = (function () {
    // Lifecycle Hooks
    function ChessboardComponent(chessService, socketService, modalService, renderer2, deviceService) {
        this.chessService = chessService;
        this.socketService = socketService;
        this.modalService = modalService;
        this.renderer2 = renderer2;
        this.deviceService = deviceService;
        this.objLoader = new THREE.OBJLoader();
        this.textLoader = new THREE.TextureLoader();
        this.mouse = new THREE.Vector2();
        this.objects = [];
        // Camera Properties
        this.camRotation = new THREE.Vector3(0, 0, 0);
        this.radius = 50;
        this.increment = Math.PI / 2;
        /* STAGE PROPERTIES */
        this.fieldOfView = 30;
        this.nearClippingPane = .1;
        this.farClippingPane = 10000;
        this.boardMultiplier = 8 / 9.2; // ratio of squares to to total squares from edge to edge
        this.piecePos = new THREE.Vector3();
    }
    Object.defineProperty(ChessboardComponent.prototype, "canvas", {
        get: function () {
            return this.canvasRef.nativeElement;
        },
        enumerable: true,
        configurable: true
    });
    ChessboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.chessService.wasPlaying()) {
            this.openModal(this.modalTemp);
        }
        this.chessService.boardChanged
            .subscribe(function (board) { return _this.animateToNewBoard(board); });
    };
    ChessboardComponent.prototype.ngAfterViewInit = function () {
        this.initScene();
        this.initLighting();
        // this.addShadowBox();
        // this.addCube();
        this.initChess();
        // this.initSphereScene();
        this.startRenderingLoop();
        this.initDraggable();
        this.onResize();
    };
    // Modal Control
    ChessboardComponent.prototype.openModal = function (template) {
        this.modalRef = this.modalService.show(template);
    };
    // Initializer
    ChessboardComponent.prototype.initScene = function () {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.getAspectRatio(), this.nearClippingPane, this.farClippingPane);
        this.camera.position.set(0, 70, this.radius);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    };
    ChessboardComponent.prototype.initLighting = function () {
        // Create a DirectionalLight and turn on shadows for the light
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(this.ambientLight);
        this.dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        this.dirLight.position.set(1, 1, 0);
        this.scene.add(this.dirLight);
    };
    ChessboardComponent.prototype.initSphereScene = function () {
        var sphere = new THREE.Mesh(new THREE.SphereGeometry(9999, 32, 32), new THREE.MeshBasicMaterial({
            // map: this.textLoader.load('assets/images/cubic_map.jpg'),
            color: 0xff00ff,
            side: THREE.DoubleSide
        }));
        this.scene.add(sphere);
    };
    ChessboardComponent.prototype.animateToNewBoard = function (board) {
        var _this = this;
        // let ids = new Set([]);
        var total = _.range(0, 32);
        var ids = [];
        this.chessService.switchTurn();
        board.forEach(function (row, i) {
            row.forEach(function (piece, j) {
                if (piece === null)
                    return;
                var name = piece['name'];
                var id = piece['id'];
                var color = piece['color'];
                var obj = _this.scene.getObjectByName(id);
                ids.push(id);
                if (obj) {
                    obj.visible = true;
                    _this.animatePiece(obj, _this.getPosFromRowCol(i, j));
                }
            });
        });
        var difference = _.difference(total, ids);
        difference.forEach(function (id) {
            var obj = _this.scene.getObjectByName(id);
            obj.visible = false;
        });
        // const set1 = new Set(ids);
        // const set2 = new Set(_.range(0, total));
    };
    // TWEEN ANIMATIONS _____________________________________________
    ChessboardComponent.prototype.rotateCameraHorizontally = function (increment) {
        var _this = this;
        // const newAlpha = dir === 'left' ? this.camRotation.x - this.increment : this.camRotation.x + this.increment;
        var newAlpha = this.camRotation.x + increment;
        this.tween = new TWEEN.Tween(this.camRotation)
            .to(new THREE.Vector3(newAlpha, 0, 0), 1000)
            .start()
            .easing(TWEEN.Easing.Exponential.InOut)
            .onUpdate(function () {
            var alpha = _this.camRotation.x;
            var v = new THREE.Vector3(0, _this.camera.position.y, 0);
            var radius = _this.camera.position.distanceTo(v);
            _this.camera.position.z = radius * Math.cos(alpha);
            _this.camera.position.x = radius * Math.sin(alpha);
            _this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        });
    };
    ChessboardComponent.prototype.rotateCameraVertically = function (offsetTheta) {
        var _this = this;
        var z = this.camera.position.z;
        var x = this.camera.position.x;
        var y = this.camera.position.y;
        var originRadius = this.camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
        var curTheta = Math.asin(y / originRadius);
        var newTheta = curTheta + offsetTheta;
        var newY = originRadius * Math.sin(newTheta);
        var d = Math.sqrt(Math.pow(originRadius, 2) - Math.pow(newY, 2));
        var alpha = Math.atan(x / z);
        var newZ = d * Math.cos(alpha);
        var newX = d * Math.sin(alpha);
        // this.camera.position.set(newX, newY, newZ);
        // this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.tween = new TWEEN.Tween(this.camera.position)
            .to(new THREE.Vector3(newX, newY, newZ), 500)
            .start()
            .easing(TWEEN.Easing.Exponential.InOut)
            .onUpdate(function () {
            _this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        });
    };
    ChessboardComponent.prototype.animatePiece = function (object, newPos) {
        this.tween = new TWEEN.Tween(object.position)
            .to(newPos, 300)
            .start()
            .easing(TWEEN.Easing.Exponential.InOut)
            .onUpdate(function () {
        });
    };
    ChessboardComponent.prototype.removePieceFromScene = function (piece) {
        var obj = this.scene.getObjectByName(piece['id']);
        if (obj) {
            obj.visible = false;
        }
    };
    ChessboardComponent.prototype.movePiece = function (object, pos) {
        var _this = this;
        var coors = this.getRowColFromPos(pos);
        var newCoors = this.getRowColFromPos(object.position);
        this.chessService.checkLegal(coors, newCoors)
            .subscribe(function (data) {
            var board = data['board'];
            var legal = data['legal'];
            _this.chessService.updateAIGame(board);
        }, function (err) { return console.log(err); });
    };
    // _______________________________________________________________________
    // Give position, get row and col
    ChessboardComponent.prototype.getRowColFromPos = function (pos) {
        var temp = new THREE.Vector3(pos.x, 0, pos.z);
        var result = new Coor(0, 0);
        var min = null;
        for (var row = 0; row < 8; row++) {
            for (var col = 0; col < 8; col += 1) {
                var coors = this.getPosFromRowCol(row, col);
                if (result == null) {
                    result.row = row;
                    result.col = col;
                }
                var v = new THREE.Vector3(coors.x, 0, coors.z);
                var len = v.sub(temp).length();
                if (min == null) {
                    min = len;
                }
                if (len < min) {
                    min = len;
                    result.row = row;
                    result.col = col;
                }
            }
        }
        return result;
    };
    ChessboardComponent.prototype.getPosFromRowCol = function (row, col) {
        var x = this.getPieceStart(this.boardLengths.size.x, this.boardLengths.min.x, col);
        var z = this.getPieceStart(this.boardLengths.size.y, this.boardLengths.min.y, row);
        return new Pos(x, z);
    };
    // Give position, get closest position
    ChessboardComponent.prototype.getClosestPos = function (pos) {
        var square = this.getRowColFromPos(pos);
        return this.getPosFromRowCol(square.row, square.col);
    };
    // Piece Positioning
    ChessboardComponent.prototype.setPiecePosition = function (row, col, obj) {
        var sizeBox = new THREE.Box3().setFromObject(obj);
        var position = this.getPosFromRowCol(row, col);
        var height = this.getPieceHeight(sizeBox.min);
        return new Vector3(position.x, height, position.z);
    };
    ChessboardComponent.prototype.getPieceStart = function (size, min, index) {
        var len = size * this.boardMultiplier;
        var edge = (size - len) / 2;
        var box_width = len / 8;
        var start = min + edge + box_width / 2;
        return start + (index * box_width);
    };
    ChessboardComponent.prototype.getPieceHeight = function (min) {
        return -min.y;
    };
    // ________________________________________________________________________
    ChessboardComponent.prototype.initDraggable = function () {
        var _this = this;
        this.dragControls = new DragControlsAdv(this.objects, this.camera, this.renderer.domElement, new THREE.Vector3(0, 1, 0));
        this.renderer2.listen(this.dragControls, 'dragstart', function (event) {
            if (_this.controls) {
                _this.controls.enabled = false;
            }
            _this.piecePos.copy(event.object.position);
        });
        this.renderer2.listen(this.dragControls, 'dragend', function (event) {
            if (_this.controls) {
                _this.controls.enabled = true;
            }
            _this.movePiece(event.object, _this.piecePos);
        });
    };
    ChessboardComponent.prototype.startRenderingLoop = function () {
        var component = this;
        /* Renderer */
        // Use canvas element in template
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // Start Orbit Control
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.update();
        // const info = this.deviceService.getDeviceInfo();
        // if (info['device'] === 'android' || info['device'] === 'iphone') {
        //   this.controls.enableZoom = false;
        //   this.controls.enableRotate = false;
        // }
        this.camera.updateMatrixWorld(true);
        // this.trackControls = new TrackballControls( this.camera, this.renderer );
        (function render() {
            requestAnimationFrame(render);
            TWEEN.update();
            // component.controls.update();
            component.updateScene();
            component.renderer.render(component.scene, component.camera);
        }());
    };
    ChessboardComponent.prototype.updateScene = function () { };
    // Adding elements to the scene
    ChessboardComponent.prototype.initChess = function () {
        var _this = this;
        this.addBoard(function () {
            _this.chessService.fetchStartGame(function (success) {
                if (success) {
                    _this.addPieces();
                }
            });
        });
    };
    ChessboardComponent.prototype.addBoard = function (callback) {
        var _this = this;
        this.objLoader.load('assets/pieces_comp/chessboard.obj', function (obj) {
            var material = new THREE.MeshStandardMaterial({ map: _this.textLoader.load('assets/images/marble.jpeg'), side: THREE.DoubleSide });
            obj.traverse(function (child) {
                child.userData.parent = obj;
                if (child instanceof THREE.Mesh) {
                    child.material = material;
                }
            });
            // obj.scale.set(0.05, 0.05, 0.05);
            var box = new THREE.Box3().setFromObject(obj);
            _this.boardLengths = { 'size': box.getSize(), 'min': box.min, 'max': box.max };
            obj.rotation.x = 3 * Math.PI / 2;
            obj.position.y = -_this.boardLengths.size.z / 2;
            _this.scene.add(obj);
            callback();
        });
    };
    ChessboardComponent.prototype.addPieces = function () {
        var _this = this;
        // Add pieces once scene is added
        var board = this.chessService.getGameBoard();
        var light_wood = this.textLoader.load("assets/images/light_wood.jpg");
        var dark_wood = this.textLoader.load("assets/images/dark_wood.jpg");
        board.forEach(function (row, row_index) {
            row.forEach(function (col, col_index) {
                if (col == null) {
                    return;
                }
                var id = col['id'];
                var color = col['color'];
                var piece = col['name'];
                // const name = this.getDetailName(piece, color, row_index, col_index);
                var name = id;
                _this.objLoader.load("assets/pieces_comp/" + piece + "_" + color + ".obj", function (obj) {
                    var pieceMat = new THREE.MeshStandardMaterial({ map: color === 'light' ? light_wood : dark_wood });
                    obj.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.material = pieceMat;
                        }
                    });
                    var pos = _this.setPiecePosition(row_index, col_index, obj);
                    obj.position.set(pos.x, pos.y, pos.z);
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                    obj.name = name;
                    // obj.id = id;
                    _this.scene.add(obj);
                    _this.objects.push(obj);
                });
            });
        });
    };
    // Utilities
    ChessboardComponent.prototype.getAspectRatio = function () {
        return this.canvas.clientWidth / this.canvas.clientHeight;
    };
    ChessboardComponent.prototype.quitGame = function () {
        this.chessService.quitGame();
        this.modalRef.hide();
    };
    ChessboardComponent.prototype.resumeGame = function () {
        this.socketService.fetchGame(this.chessService.getGameId());
        this.modalRef.hide();
    };
    // Event Handlers
    ChessboardComponent.prototype.updateMouse = function (event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    ChessboardComponent.prototype.onResize = function () {
        this.canvas.style.width = '100%';
        this.canvas.style.height = this.canvas.clientWidth * 0.9 + "px";
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
    };
    ChessboardComponent.prototype.onMouseMove = function (event) {
        this.updateMouse(event);
    };
    __decorate([
        ViewChild('template'),
        __metadata("design:type", Object)
    ], ChessboardComponent.prototype, "modalTemp", void 0);
    __decorate([
        ViewChild('canvas'),
        __metadata("design:type", ElementRef)
    ], ChessboardComponent.prototype, "canvasRef", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ChessboardComponent.prototype, "fieldOfView", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ChessboardComponent.prototype, "nearClippingPane", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ChessboardComponent.prototype, "farClippingPane", void 0);
    __decorate([
        HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ChessboardComponent.prototype, "onResize", null);
    __decorate([
        HostListener('mousemove', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ChessboardComponent.prototype, "onMouseMove", null);
    ChessboardComponent = __decorate([
        Component({
            selector: 'app-chessboard',
            templateUrl: './chessboard.component.html',
            styleUrls: ['./chessboard.component.scss']
        }),
        __metadata("design:paramtypes", [ChessService,
            IoService,
            BsModalService,
            Renderer2,
            Ng2DeviceService])
    ], ChessboardComponent);
    return ChessboardComponent;
}());
export { ChessboardComponent };
//# sourceMappingURL=chessboard.component.js.map