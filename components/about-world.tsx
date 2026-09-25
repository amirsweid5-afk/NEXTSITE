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
	SphereGeometry,
} from 'three'

interface AboutWorldProps {
	progress: { current: number }
	shardCount: number
}

const GOLD = new Color('#d3ac2c')
const ORANGE = new Color('#e87812')
const INK = new Color('#010203')

const THREAD_VERT = `
	attribute float aSeed;
	uniform float uProgress;
	varying float vSeed;

	float hash(float n) {
		return fract(sin(n) * 43758.5453);
	}

	void main() {
		float seed = aSeed;
		vSeed = seed;
		float weave = smoothstep(0.05, 0.72, uProgress);
		float gather = smoothstep(0.78, 1.0, uProgress);
		float angle = seed * 18.0 + weave * 7.5;
		float radius = mix(0.18, 1.85, weave);
		float height = mix(0.0, (seed - 0.5) * 4.4, weave);
		vec3 spun = vec3(cos(angle) * radius, height, sin(angle) * radius);
		float side = seed < 0.5 ? -1.15 : 1.15;
		vec3 edge = vec3(side, (hash(seed * 5.0) - 0.5) * 2.2, 0.35);
		vec3 pos = mix(spun, edge, gather);
		vec4 local = instanceMatrix * vec4(position, 1.0);
		local.xyz += pos;
		gl_Position = projectionMatrix * modelViewMatrix * local;
	}
`

const THREAD_FRAG = `
	varying float vSeed;
	uniform vec3 uGold;
	uniform vec3 uOrange;

	void main() {
		vec3 color = mix(uGold, uOrange, step(0.72, fract(vSeed * 9.0)));
		gl_FragColor = vec4(color, 0.9);
	}
`

const PAGE_VERT = `
	varying vec2 vUv;
	void main() {
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`

const PAGE_FRAG = `
	varying vec2 vUv;
	uniform vec3 uGold;
	uniform vec3 uInk;

	void main() {
		float edge = step(0.03, vUv.x) * step(vUv.x, 0.97)
			* step(0.04, vUv.y) * step(vUv.y, 0.96);
		float rule = step(0.93, fract(vUv.y * 9.0));
		vec3 color = mix(uGold, uInk, edge);
		color += uGold * rule * edge * 0.55;
		gl_FragColor = vec4(color, 0.86);
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

/**
 * Gold thread that unspools from a knot into a helix.
 */
function Thread ({
	progress,
	shardCount,
}: AboutWorldProps) {
	const mesh = useRef<InstancedMesh>(null)
	const material = useRef<ShaderMaterial>(null)
	const geometry = useMemo(() => new SphereGeometry(0.028, 6, 6), [])

	useLayoutEffect(() => {
		const current = mesh.current
		if (!current) return

		const dummy = new Object3D()
		const seeds = new Float32Array(shardCount)

		for (let index = 0; index < shardCount; index += 1) {
			dummy.updateMatrix()
			current.setMatrixAt(index, dummy.matrix)
			seeds[index] = (index + 0.2) / shardCount
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
				vertexShader={THREAD_VERT}
				fragmentShader={THREAD_FRAG}
				transparent
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
 * Chapter pages that fan open, then close into one plane.
 */
function ChapterPages ({
	progress,
}: {
	progress: AboutWorldProps['progress']
}) {
	const groups = useRef<Array<Group | null>>([])

	useFrame(() => {
		const t = progress.current
		const close = ramp(t, 0.76, 0.98)

		groups.current.forEach((group, index) => {
			if (!group) return
			const open = ramp(t, 0.08 + index * 0.14, 0.3 + index * 0.12)
			const side = index % 2 === 0 ? -1 : 1
			group.position.set(
				side * 0.72 * open * (1 - close),
				-1.15 + index * 0.62 * (1 - close * 0.85),
				0.08 * open,
			)
			group.rotation.set(
				(1 - open) * 0.7,
				side * (1 - open) * 1.15 * (1 - close),
				side * (1 - open) * 0.2,
			)
			group.scale.setScalar(0.86 + open * 0.2)
		})
	})

	return (
		<>
			{[0, 1, 2, 3].map((index) => (
				<group
					key={index}
					ref={(node) => {
						groups.current[index] = node
					}}
				>
					<mesh>
						<planeGeometry args={[1.15, 1.55]} />
						<shaderMaterial
							vertexShader={PAGE_VERT}
							fragmentShader={PAGE_FRAG}
							transparent
							side={2}
							uniforms={{
								uGold: { value: GOLD },
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
 * About page: a story unspools, fans into chapters, then closes.
 */
export function AboutWorld ({
	progress,
	shardCount,
}: AboutWorldProps) {
	const spine = useRef<Group>(null)

	useFrame(({ camera }) => {
		const t = progress.current
		const arc = t * Math.PI
		camera.position.set(
			Math.cos(arc) * 4.4,
			0.55 - t * 0.35,
			Math.sin(arc) * 3.2 + 2.4,
		)
		camera.lookAt(0, 0, 0)

		if (spine.current) {
			const height = 0.15 + ramp(t, 0.04, 0.7) * 3.8
			spine.current.scale.set(1, height, 1)
		}
	})

	return (
		<>
			<color attach="background" args={['#010203']} />
			<ambientLight intensity={0.4} />
			<group ref={spine} position={[0, -0.2, 0]}>
				<mesh>
					<cylinderGeometry args={[0.018, 0.018, 1, 12]} />
					<meshBasicMaterial color="#d3ac2c" />
				</mesh>
			</group>
			<Thread progress={progress} shardCount={shardCount} />
			<ChapterPages progress={progress} />
		</>
	)
}
