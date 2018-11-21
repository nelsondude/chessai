import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {Object3D, Vector3} from 'three';
import {ChessService} from '../../services/chess.service';
import {IoService} from '../../services/io.service';
import {Coor, Pos} from '../../globals/classes';

import DragControlsAdv from 'drag-controls-adv';

const ObjLoader = require('three-obj-loader')(THREE);

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import * as _ from 'underscore';

import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Ng2DeviceService} from 'ng2-device-detector';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

// Axis Orientation
//    Y
//    |
//    |
//    |_______ X
//   / Board goes here
//  /
// Z


@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.scss']
})
export class ChessboardComponent implements AfterViewInit, OnInit {
  // Modal Controls
  modalRef: BsModalRef;
  @ViewChild('template') modalTemp;

  // Three Elements
  private camera: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  @ViewChild('canvas')
  private canvasRef: ElementRef;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private objLoader: THREE.OBJLoader = new THREE.OBJLoader();
  private textLoader: THREE.TextureLoader = new THREE.TextureLoader();
  private dirLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private dragControls: any;
  private controls: any;
  private objects: Object3D[] = [];
  public tween: any;

  // Camera Properties
  public camRotation = new THREE.Vector3(0, 0, 0);
  public radius = 50;


  /* STAGE PROPERTIES */
  @Input() public fieldOfView = 30;
  @Input() public nearClippingPane = .1;
  @Input() public farClippingPane = 10000;

  // Chess Properties
  public boardLengths: { size: THREE.Vector3, min: THREE.Vector3, max: THREE.Vector3 };
  public boardMultiplier = 8 / 9.2; // ratio of squares to to total squares from edge to edge
  public piecePos = new THREE.Vector3();

  // Lifecycle Hooks
  constructor(public chessService: ChessService,
              public socketService: IoService,
              private modalService: BsModalService,
              private renderer2: Renderer2,
              private deviceService: Ng2DeviceService,
              private spinnerService: Ng4LoadingSpinnerService) {
  }

  ngOnInit() {
    this.chessService.boardChanged
      .subscribe(
        (board) => this.animateToNewBoard(board)
      );
    this.chessService.rotateBoardVertically
      .subscribe(
        (increment) => {
          this.rotateCameraVertically(increment);
        }
      );
    this.chessService.rotateBoardHorizontally
      .subscribe(
        (increment) => {
          this.rotateCameraHorizontally(increment);
        }
      )
  }

  ngAfterViewInit() {
    this.initScene();
    this.initLighting();
    this.initChess();
    this.startRenderingLoop();
    this.initDraggable();
    this.onResize();
  }

  // Modal Control
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  // Initializer
  initScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      this.getAspectRatio(),
      this.nearClippingPane,
      this.farClippingPane
    );
    this.camera.position.set(0, 70, this.radius);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  initLighting() {
    // Create a DirectionalLight and turn on shadows for the light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    this.dirLight.position.set(1, 1, 0);
    this.scene.add(this.dirLight);
  }

  animateToNewBoard(board) {
    const total = _.range(0, 32);
    const ids = [];
    board.forEach((row, i) => {
      row.forEach((piece, j) => {
        if (piece === null) return;
        const id = piece['id'];
        const obj = this.scene.getObjectByName(id);
        ids.push(id);
        if (obj) {
          obj.visible = true;
          this.animatePiece(obj, this.getPosFromRowCol(i, j));
        }
      });
    });
    const difference = _.difference(total, ids);
    difference.forEach(id => {
      const obj = this.scene.getObjectByName(id);
      obj.visible = false;
    });
  }

  // TWEEN ANIMATIONS _____________________________________________

  rotateCameraHorizontally(increment) {
    const newAlpha = this.camRotation.x + increment;
    this.tween = new TWEEN.Tween(this.camRotation)
      .to(new THREE.Vector3(newAlpha, 0, 0), 1000)
      .start()
      .easing(TWEEN.Easing.Exponential.InOut)
      .onUpdate(() => {
        const alpha = this.camRotation.x;
        const v = new THREE.Vector3(0, this.camera.position.y, 0);
        const radius = this.camera.position.distanceTo(v);
        this.camera.position.z = radius * Math.cos(alpha);
        this.camera.position.x = radius * Math.sin(alpha);
        // Keep the camera pointed at the origin of the scene
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      });
  }


  rotateCameraVertically(offsetTheta: number) {
    const z = this.camera.position.z;
    const x = this.camera.position.x;
    const y = this.camera.position.y;
    const originRadius = this.camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
    const curTheta = Math.asin(y / originRadius);
    const newTheta = curTheta + offsetTheta;

    const newY = originRadius * Math.sin(newTheta);
    const d = Math.sqrt(originRadius ** 2 - newY ** 2);
    const alpha = Math.atan(x / z);
    const newZ = d * Math.cos(alpha);
    const newX = d * Math.sin(alpha);
    // this.camera.position.set(newX, newY, newZ);
    // this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.tween = new TWEEN.Tween(this.camera.position)
      .to(new THREE.Vector3(newX, newY, newZ), 500)
      .start()
      .easing(TWEEN.Easing.Exponential.InOut)
      .onUpdate(() => {
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      });
  }

  animatePiece(object, newPos) {
    this.tween = new TWEEN.Tween(object.position)
      .to(newPos, 300)
      .start()
      .easing(TWEEN.Easing.Exponential.InOut)
      .onUpdate(() => {
      });
  }

  doUserMove(dragstart_pos: THREE.Vector3, dragend_pos: THREE.Vector3) {
    const dragstart_coors = this.getRowColFromPos(dragstart_pos);
    const dragend_coors = this.getRowColFromPos(dragend_pos);
    this.chessService.doUserChessMove(dragstart_coors, dragend_coors)
      .subscribe(
        (data) => {
          const board = data['board'];
          const legal = data['legal'];
          this.animateToNewBoard(board);
          this.chessService.setBoard(board);
          if (!legal) {
            alert("That was not a legal move!");
            // Don't Switch turn since not legal move
            // Show not valid move error
          } else if (this.chessService.isAIMode()) {
            this.spinnerService.show();
            this.chessService.switchTurn();
            this.chessService.doAIChessMove()
              .subscribe(
                (data) => {
                  const ai_board = data['board'];
                  const mate = data['mate'];
                  this.animateToNewBoard(ai_board);
                  this.chessService.setBoard(ai_board);
                  this.chessService.switchTurn();
                  if (mate) {
                    alert('Checkmate!!');
                  }
                }, () => {
                  this.spinnerService.hide();
                  alert("An error occurred with the server... we will fix this");
                }, () => {
                  this.spinnerService.hide()
                }
              )
          } else if (this.chessService.isHumanMode()) {
            this.chessService.switchTurn();
            this.rotateCameraHorizontally(Math.PI);
          } else if (this.chessService.isMultiplayerMode()) {
            this.socketService.updateGame();
          }
        }
      );
  }

  // _______________________________________________________________________

  // Give position, get row and col
  getRowColFromPos(pos: THREE.Vector3): Coor {
    const temp = new THREE.Vector3(pos.x, 0, pos.z);
    const result = new Coor(0, 0);
    let min = null;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col += 1) {
        const coors = this.getPosFromRowCol(row, col);
        if (result == null) {
          result.row = row;
          result.col = col;
        }
        const v = new THREE.Vector3(coors.x, 0, coors.z);
        const len = v.sub(temp).length();
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
  }

  getPosFromRowCol(row: number, col: number): Pos {
    const x = this.getPieceStart(this.boardLengths.size.x, this.boardLengths.min.x, col);
    const z = this.getPieceStart(this.boardLengths.size.y, this.boardLengths.min.y, row);
    return new Pos(x, z);
  }

  // Piece Positioning

  setPiecePosition(row, col, obj): THREE.Vector3 {
    const sizeBox = new THREE.Box3().setFromObject(obj);
    const position = this.getPosFromRowCol(row, col);
    const height = this.getPieceHeight(sizeBox.min);
    return new Vector3(position.x, height, position.z);
  }

  getPieceStart(size, min, index) {
    const len = size * this.boardMultiplier;
    const edge = (size - len) / 2;
    const box_width = len / 8;
    const start = min + edge + box_width / 2;
    return start + (index * box_width);
  }


  getPieceHeight(min: THREE.Vector3) {
    return -min.y;
  }

  // ________________________________________________________________________

  initDraggable() {
    this.dragControls = new DragControlsAdv(
      this.objects,
      this.camera,
      this.renderer.domElement,
      new THREE.Vector3(0, 1, 0)
    );

    this.renderer2.listen(this.dragControls, 'dragstart', (event) => {
      if (this.controls) {
        this.controls.enabled = false;
      }
      this.piecePos.copy(event.object.position);
    });


    this.renderer2.listen(this.dragControls, 'dragend', (event) => {
      if (this.controls) {
        this.controls.enabled = true;
      }
      const dragstart_pos = this.piecePos;
      const dragend_pos = event.object.position;
      this.doUserMove(dragstart_pos, dragend_pos);
    });
  }


  startRenderingLoop() {
    const component: ChessboardComponent = this;
    /* Renderer */
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, alpha: true});
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0x000000, 0);
    this.camera.updateMatrixWorld(true);

    (function render() {
      requestAnimationFrame(render);
      TWEEN.update();
      component.renderer.render(component.scene, component.camera);
    }());
  }

  // Adding elements to the scene

  initChess() {
    this.addBoard(() => {
      this.chessService.fetchStartGame()
        .subscribe(
          data => {
            this.chessService.setBoard(data['board']);
            this.addPieces();
          }
        )
    });
  }

  addBoard(callback) {
    this.objLoader.load('assets/pieces_comp/chessboard.obj', (obj: THREE.Object3D) => {
      const material = new THREE.MeshStandardMaterial({map: this.textLoader.load('assets/images/marble.jpeg'), side: THREE.DoubleSide});
      obj.traverse(function (child) {
        child.userData.parent = obj;
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });
      // obj.scale.set(0.05, 0.05, 0.05);
      const box = new THREE.Box3().setFromObject(obj);
      this.boardLengths = {'size': box.getSize(), 'min': box.min, 'max': box.max};

      obj.rotation.x = 3 * Math.PI / 2;
      obj.position.y = -this.boardLengths.size.z / 2;
      this.scene.add(obj);
      callback();
    });
  }

  addPieces() {
    // Add pieces once scene is added
    const board = this.chessService.getGameBoard();
    const light_wood = this.textLoader.load(`assets/images/light_wood.jpg`);
    const dark_wood = this.textLoader.load(`assets/images/dark_wood.jpg`);

    board.forEach((row, row_index) => {
      row.forEach((col, col_index) => {
        if (col == null) {
          return;
        }
        const id = col['id'];
        const color = col['color'];
        const piece = col['name'];
        // const name = this.getDetailName(piece, color, row_index, col_index);
        const name = id;
        this.objLoader.load(`assets/pieces_comp/${piece}_${color}.obj`, (obj: THREE.Object3D) => {
          const pieceMat = new THREE.MeshStandardMaterial({map: color === 'light' ? light_wood : dark_wood});
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = pieceMat;
            }
          });
          const pos = this.setPiecePosition(row_index, col_index, obj);
          obj.position.set(pos.x, pos.y, pos.z);
          obj.castShadow = true;
          obj.receiveShadow = true;
          obj.name = name;
          // obj.id = id;
          this.scene.add(obj);
          this.objects.push(obj);
        });
      });
    });
  }

  // Utilities

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  quitGame() {
    this.chessService.quitGame();
    this.modalRef.hide();
  }

  resumeGame() {
    this.socketService.fetchGame(this.chessService.getGameId());
    this.modalRef.hide();
  }

  // Event Handlers

  updateMouse(event: any) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.canvas.style.width = '100%';
    this.canvas.style.height = `${this.canvas.clientWidth * 0.9}px`;
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: any) {
    this.updateMouse(event);
  }
}

