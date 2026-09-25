'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
	type Group,
	type InstancedMesh,
	type ShaderMaterial,
	Color,
	InstancedBufferAttribute,
	Object3D,
	TetrahedronGeometry,
} from 'three'

interface BirthWorldProps {
	progress: { current: number }
	shardCount: number
}

const ORANGE = new Color('#e87812')
const GOLD = new Color('#d3ac2c')
const INK = new Color('#010203')

const CHROME_VERT = `
	varying vec3 vNormal;
	varying float vNoise;
	uniform float uProgress;

	float hash(vec3 p) {
		return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
	}

	void main() {
		float n = hash(position * 2.4);
		vNoise = n;
		float open = smoothstep(0.06, 0.38, uProgress);
		float vanish = 1.0 - smoothstep(0.36, 0.58, uProgress);
		vec3 displaced = position * mix(1.0, 0.15, smoothstep(0.42, 0.6, uProgress));
		displaced += normal * n * open * 0.55;
		vec4 world = modelMatrix * vec4(displaced, 1.0);
		vNormal = normalize(normalMatrix * normal);
		gl_Position = projectionMatrix * viewMatrix * world;
		vNoise = n * vanish;
	}
`

const CHROME_FRAG = `
	varying vec3 vNormal;
	varying float vNoise;
	uniform float uProgress;
	uniform vec3 uGold;
	uniform vec3 uOrange;
	uniform vec3 uInk;

	void main() {
		float fresnel = pow(
			1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.15, 0.95)), 0.0),
			1.7
		);
		float crack = smoothstep(0.62, 0.74, vNoise)
			* smoothstep(0.1, 0.36, uProgress);
		vec3 color = mix(uInk, uGold, fresnel);
		color = mix(color, uOrange, crack);
		color += uGold * fresnel * 0.35;
		float alpha = (1.0 - smoothstep(0.34, 0.6, uProgress))
			* (0.55 + fresnel * 0.45);
		if (alpha < 0.03) discard;
		gl_FragColor = vec4(color, alpha);
	}
`

const SHARD_VERT = `
	attribute float aSeed;
	uniform float uProgress;
	varying float vSeed;
	varying float vFade;
	varying vec3 vNormal;

	float hash(float n) {
		return fract(sin(n) * 43758.5453);
	}

	void main() {
		float seed = aSeed;
		vSeed = seed;
		float burst = smoothstep(0.1, 0.42, uProgress);
		float form = smoothstep(0.4, 0.68, uProgress);
		float collapse = smoothstep(0.7, 0.88, uProgress);
		float portal = smoothstep(0.84, 1.0, uProgress);

		float angle = seed * 6.2831853 + burst * 6.2;
		float radius = mix(0.15, 0.35 + hash(seed * 2.2) * 2.8, burst);
		vec3 cracked = vec3(
			cos(angle) * radius,
			sin(angle * 0.82) * radius * 0.66,
			sin(angle) * radius * 0.48
		);

		float which = floor(hash(seed * 19.2) * 3.0);
		vec3 origin = which < 0.5
			? vec3(-1.75, 0.28, 0.1)
			: which < 1.5
				? vec3(1.7, 0.48, -0.05)
				: vec3(0.05, -0.95, 0.25);
		vec3 formed = origin + vec3(
			(hash(seed * 3.1) - 0.5) * 1.05,
			(hash(seed * 7.4) - 0.5) * 0.72,
			(hash(seed * 11.0) - 0.5) * 0.2
		);

		vec3 pos = mix(cracked, formed, form);
		pos = mix(pos, vec3(0.0, -0.15, 0.0), collapse);

		float ringAngle = seed * 6.2831853;
		float ringRadius = 1.45 + hash(seed * 5.0) * 0.45;
		vec3 ring = vec3(
			cos(ringAngle) * ringRadius,
			sin(ringAngle) * ringRadius * 0.62 - 0.2,
			sin(ringAngle * 2.0) * 0.08
		);
		pos = mix(pos, ring, portal);

		vec3 trail = normalize(cracked + vec3(0.0001));
		float flight = burst * (1.0 - form);
		vec3 stretched = position + trail * dot(position, trail) * flight * 14.0;

		vec4 local = instanceMatrix * vec4(stretched, 1.0);
		local.xyz += pos;
		vNormal = normalize(normalMatrix * normal);
		vFade = mix(burst, 1.0, portal);
		gl_Position = projectionMatrix * modelViewMatrix * local;
	}
`

const SHARD_FRAG = `
	varying float vSeed;
	varying float vFade;
	varying vec3 vNormal;
	uniform vec3 uGold;
	uniform vec3 uOrange;

	void main() {
		float fresnel = pow(
			1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))),
			1.6
		);
		vec3 tint = mix(uGold, uOrange, fract(vSeed * 4.7));
		vec3 color = mix(tint * 0.35, vec3(1.0, 0.96, 0.9), fresnel);
		float alpha = (0.22 + fresnel * 0.78) * vFade;
		if (alpha < 0.02) discard;
		gl_FragColor = vec4(color, alpha);
	}
`

const FRAME_VERT = `
	varying vec2 vUv;
	void main() {
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`

const FRAME_FRAG = `
	varying vec2 vUv;
	uniform float uKind;
	uniform vec3 uGold;
	uniform vec3 uOrange;
	uniform vec3 uInk;

	void main() {
		float frame = step(0.045, vUv.x) * step(vUv.x, 0.955)
			* step(0.08, vUv.y) * step(vUv.y, 0.955);
		float bar = step(0.9, vUv.y);
		float columns = step(0.48, vUv.x) * step(vUv.x, 0.52);
		float rows = step(0.96, fract(vUv.y * 7.0));
		vec3 color = mix(uOrange, uInk, frame);
		color = mix(color, uGold, bar);
		if (uKind > 0.5 && uKind < 1.5) {
			color = mix(color, uGold, columns * frame);
		}
		if (uKind > 1.5) {
			color += uOrange * rows * frame * 0.65;
		}
		gl_FragColor = vec4(color, 0.88);
	}
`

const PORTAL_VERT = `
	varying vec3 vNormal;
	void main() {
		vNormal = normalize(normalMatrix * normal);
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`

const PORTAL_FRAG = `
	varying vec3 vNormal;
	uniform vec3 uGold;
	uniform vec3 uOrange;
	uniform float uProgress;

	void main() {
		float fresnel = pow(
			1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0),
			2.2
		);
		float glow = smoothstep(0.86, 1.0, uProgress);
		vec3 color = mix(uGold, uOrange, fresnel);
		gl_FragColor = vec4(color * (0.6 + fresnel), glow);
	}
`

/**
 * Maps a value into a 0–1 ramp between two scroll stops.
 */
function ramp (value: number, start: number, end: number) {
	const span = end - start
	if (span <= 0) return value >= end ? 1 : 0
	return Math.min(1, Math.max(0, (value - start) / span))
}

interface FramePose {
	from: [number, number, number]
	to: [number, number, number]
	spin: number
	kind: number
}

const FRAMES: FramePose[] = [
	{
		from: [-2.6, 1.5, -1.2],
		to: [-1.72, 0.22, 0.05],
		spin: 1.15,
		kind: 0,
	},
	{
		from: [2.5, -1.3, -0.8],
		to: [1.68, 0.42, 0.0],
		spin: -0.95,
		kind: 1,
	},
	{
		from: [0.2, 2.1, -1.6],
		to: [0.06, -0.92, 0.2],
		spin: 0.7,
		kind: 2,
	},
]

/**
 * Liquid-chrome seed that cracks apart as scroll progress rises.
 */
function ChromeSeed ({
	progress,
}: {
	progress: BirthWorldProps['progress']
}) {
	const material = useRef<ShaderMaterial>(null)

	useFrame(() => {
		if (!material.current) return
		material.current.uniforms.uProgress.value = progress.current
	})

	return (
		<mesh>
			<icosahedronGeometry args={[1.15, 5]} />
			<shaderMaterial
				ref={material}
				vertexShader={CHROME_VERT}
				fragmentShader={CHROME_FRAG}
				transparent
				depthWrite={false}
				uniforms={{
					uProgress: { value: 0 },
					uGold: { value: GOLD },
					uOrange: { value: ORANGE },
					uInk: { value: INK },
				}}
			/>
		</mesh>
	)
}

/**
 * Glass shards whose flight, assembly, and portal are scroll-locked.
 */
function ShardField ({
	progress,
	shardCount,
}: BirthWorldProps) {
	const mesh = useRef<InstancedMesh>(null)
	const material = useRef<ShaderMaterial>(null)
	const geometry = useMemo(
		() => new TetrahedronGeometry(0.045, 0),
		[],
	)

	useLayoutEffect(() => {
		const current = mesh.current
		if (!current) return

		const dummy = new Object3D()
		const seeds = new Float32Array(shardCount)

		for (let index = 0; index < shardCount; index += 1) {
			dummy.rotation.set(index, index * 0.37, index * 0.11)
			dummy.updateMatrix()
			current.setMatrixAt(index, dummy.matrix)
			seeds[index] = (index + 0.37) / shardCount
		}

		current.instanceMatrix.needsUpdate = true
		geometry.setAttribute(
			'aSeed',
			new InstancedBufferAttribute(seeds, 1),
		)
		current.frustumCulled = false
	}, [geometry, shardCount])

	useFrame(() => {
		if (!material.current) return
		material.current.uniforms.uProgress.value = progress.current
	})

	return (
		<instancedMesh
			ref={mesh}
			args={[geometry, undefined, shardCount]}
		>
			<shaderMaterial
				ref={material}
				vertexShader={SHARD_VERT}
				fragmentShader={SHARD_FRAG}
				transparent
				depthWrite={false}
				uniforms={{
					uProgress: { value: 0 },
					uGold: { value: GOLD },
					uOrange: { value: ORANGE },
				}}
			/>
		</instancedMesh>
	)
}

/**
 * Three website frames that assemble, then fold away.
 */
function ServiceFrames ({
	progress,
}: {
	progress: BirthWorldProps['progress']
}) {
	const groups = useRef<Array<Group | null>>([])

	useFrame(() => {
		const t = progress.current
		const visible = ramp(t, 0.4, 0.62) * (1 - ramp(t, 0.74, 0.9))

		FRAMES.forEach((frame, index) => {
			const group = groups.current[index]
			if (!group) return

			const mix = ramp(t, 0.38 + index * 0.03, 0.66)
			group.position.set(
				frame.from[0] + (frame.to[0] - frame.from[0]) * mix,
				frame.from[1] + (frame.to[1] - frame.from[1]) * mix,
				frame.from[2] + (frame.to[2] - frame.from[2]) * mix,
			)
			group.rotation.set(
				(1 - mix) * 0.9,
				frame.spin * (1 - mix),
				frame.spin * (1 - mix) * 0.35,
			)
			const scale = visible * (0.72 + mix * 0.38)
			group.scale.setScalar(scale)
			group.visible = scale > 0.02
		})
	})

	return (
		<>
			{FRAMES.map((frame) => (
				<group
					key={frame.kind}
					ref={(node) => {
						groups.current[frame.kind] = node
					}}
				>
					<mesh>
						<planeGeometry args={[1.35, 0.92]} />
						<shaderMaterial
							vertexShader={FRAME_VERT}
							fragmentShader={FRAME_FRAG}
							transparent
							side={2}
							uniforms={{
								uKind: { value: frame.kind },
								uGold: { value: GOLD },
								uOrange: { value: ORANGE },
								uInk: { value: INK },
							}}
						/>
					</mesh>
				</group>
			))}
		</>
	)
}

/**
 * Portal ring that opens around the booking call to action.
 */
function Portal ({
	progress,
}: {
	progress: BirthWorldProps['progress']
}) {
	const group = useRef<Group>(null)
	const materials = useRef<Array<ShaderMaterial | null>>([])

	useFrame(() => {
		const t = progress.current
		const open = ramp(t, 0.84, 1)

		if (group.current) {
			const scale = 0.04 + open * 1.15
			group.current.scale.setScalar(scale)
			group.current.rotation.z = t * Math.PI * 1.4
			group.current.visible = open > 0.01
		}

		materials.current.forEach((material) => {
			if (!material) return
			material.uniforms.uProgress.value = t
		})
	})

	return (
		<group ref={group} position={[0, -0.2, 0]} rotation={[1.15, 0, 0]}>
			{[1.55, 1.15].map((radius, index) => (
				<mesh key={radius}>
					<torusGeometry
						args={[
							radius,
							index === 0 ? 0.028 : 0.012,
							12,
							80,
						]}
					/>
					<shaderMaterial
						ref={(node) => {
							materials.current[index] = node
						}}
						vertexShader={PORTAL_VERT}
						fragmentShader={PORTAL_FRAG}
						transparent
						depthWrite={false}
						uniforms={{
							uProgress: { value: 0 },
							uGold: { value: GOLD },
							uOrange: { value: ORANGE },
						}}
					/>
				</mesh>
			))}
		</group>
	)
}

/**
 * One scroll-driven world: chrome birth, glass assembly, portal.
 */
export function BirthWorld ({
	progress,
	shardCount,
}: BirthWorldProps) {
	useFrame(({ camera }) => {
		const t = progress.current
		const dive = ramp(t, 0.18, 0.72)
		const retreat = ramp(t, 0.8, 1)
		camera.position.set(
			Math.sin((t - 0.5) * 1.1) * 1.15,
			0.42 - t * 0.7,
			6.4 - dive * 2.35 + retreat * 1.15,
		)
		camera.lookAt(0, -0.12 * t, 0)
	})

	return (
		<>
			<color attach="background" args={['#010203']} />
			<ambientLight intensity={0.35} />
			<ChromeSeed progress={progress} />
			<ShardField progress={progress} shardCount={shardCount} />
			<ServiceFrames progress={progress} />
			<Portal progress={progress} />
		</>
	)
}
